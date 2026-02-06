const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');

const HOSTS_FILE = '/etc/hosts';
const BACKUP_DIR = path.join(os.homedir(), '.hostpilot', 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1000,
        minHeight: 700,
        frame: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0a0a0f',
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Load Vite dev server in development
    if (!app.isPackaged && process.env.NODE_ENV !== 'production') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Path resolution for packaged app
        const indexPath = path.join(app.getAppPath(), 'dist', 'index.html');
        console.log('App path:', app.getAppPath());
        console.log('Loading index from:', indexPath);

        mainWindow.loadFile(indexPath).catch(err => {
            console.error('Failed to load index.html:', err);
            // Fallback for different packaging structures
            const fallbackPath = path.join(__dirname, '..', 'dist', 'index.html');
            mainWindow.loadFile(fallbackPath);
        });
    }

    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        console.error('Page failed to load:', errorCode, errorDescription);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Parse hosts file into structured data
function parseHostsFile(content) {
    const lines = content.split('\n');
    const entries = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) return;

        // Check if line is a comment (disabled entry or regular comment)
        const isDisabled = trimmed.startsWith('#');
        const cleanLine = isDisabled ? trimmed.substring(1).trim() : trimmed;

        // Extract project tag from comment: # [ProjectName]
        let projectTag = null;
        const projectMatch = cleanLine.match(/\[([^\]]+)\]$/);
        if (projectMatch) {
            projectTag = projectMatch[1];
        }

        // Parse IP and domains
        const parts = cleanLine.replace(/\[([^\]]+)\]$/, '').trim().split(/\s+/);
        if (parts.length >= 2) {
            const ip = parts[0];
            const domain = parts[1];
            const comment = parts.slice(2).join(' ').replace(/^#\s*/, '');

            // Validate IP format (basic IPv4 check)
            const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipv4Regex.test(ip) || ip === '::1' || ip.includes(':')) {
                entries.push({
                    id: `host-${index}-${Date.now()}`,
                    ip,
                    domain,
                    projectTag,
                    comment: comment || '',
                    enabled: !isDisabled,
                    lineNumber: index,
                });
            }
        }
    });

    return entries;
}

// Convert structured data back to hosts file format
function generateHostsContent(entries) {
    const lines = [];

    // Add header
    lines.push('# /etc/hosts - Managed by HostPilot');
    lines.push('# Do not edit manually unless you know what you are doing');
    lines.push('');

    entries.forEach(entry => {
        let line = `${entry.ip}\t${entry.domain}`;
        if (entry.comment) {
            line += `\t# ${entry.comment}`;
        }
        if (entry.projectTag) {
            line += ` [${entry.projectTag}]`;
        }
        if (!entry.enabled) {
            line = '# ' + line;
        }
        lines.push(line);
    });

    return lines.join('\n') + '\n';
}

// IPC Handlers

// Get hosts entries
ipcMain.handle('hosts:get', async () => {
    try {
        const content = fs.readFileSync(HOSTS_FILE, 'utf8');
        return { success: true, entries: parseHostsFile(content) };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Save hosts entries (requires elevation)
ipcMain.handle('hosts:save', async (event, entries) => {
    try {
        // Create backup first
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `hosts-backup-${timestamp}`);

        const currentContent = fs.readFileSync(HOSTS_FILE, 'utf8');
        fs.writeFileSync(backupPath, currentContent);

        // Generate new content
        const newContent = generateHostsContent(entries);

        // Write to temp file first
        const tempFile = path.join(os.tmpdir(), 'hosts-temp');
        fs.writeFileSync(tempFile, newContent);

        // Platform-specific elevation
        const command = process.platform === 'darwin'
            ? `osascript -e 'do shell script "cp ${tempFile} ${HOSTS_FILE}" with administrator privileges'`
            : `pkexec cp ${tempFile} ${HOSTS_FILE}`;

        return new Promise((resolve) => {
            exec(command, (error) => {
                // Clean up temp file
                try { fs.unlinkSync(tempFile); } catch (e) { }

                if (error) {
                    console.error('Elevation error:', error);
                    resolve({ success: false, error: error.message });
                } else {
                    resolve({ success: true, backupPath });
                }
            });
        });
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Create backup
ipcMain.handle('hosts:backup', async () => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `hosts-backup-${timestamp}`);

        const content = fs.readFileSync(HOSTS_FILE, 'utf8');
        fs.writeFileSync(backupPath, content);

        return { success: true, backupPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Get backups list
ipcMain.handle('hosts:getBackups', async () => {
    try {
        const files = fs.readdirSync(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('hosts-backup-'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                date: fs.statSync(path.join(BACKUP_DIR, f)).mtime,
            }))
            .sort((a, b) => b.date - a.date);

        return { success: true, backups };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Restore from backup
ipcMain.handle('hosts:restore', async (event, backupPath) => {
    try {
        const content = fs.readFileSync(backupPath, 'utf8');
        const tempFile = path.join(os.tmpdir(), 'hosts-restore');
        fs.writeFileSync(tempFile, content);

        // Platform-specific elevation
        const command = process.platform === 'darwin'
            ? `osascript -e 'do shell script "cp ${tempFile} ${HOSTS_FILE}" with administrator privileges'`
            : `pkexec cp ${tempFile} ${HOSTS_FILE}`;

        return new Promise((resolve) => {
            exec(command, (error) => {
                try { fs.unlinkSync(tempFile); } catch (e) { }

                if (error) {
                    resolve({ success: false, error: error.message });
                } else {
                    resolve({ success: true });
                }
            });
        });
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Window controls
ipcMain.handle('window:minimize', () => mainWindow.minimize());
ipcMain.handle('window:maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.handle('window:close', () => mainWindow.close());
