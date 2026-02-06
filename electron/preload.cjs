const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('hostAPI', {
    // Get all host entries
    getHosts: () => ipcRenderer.invoke('hosts:get'),

    // Save host entries (creates backup automatically)
    saveHosts: (entries) => ipcRenderer.invoke('hosts:save', entries),

    // Create manual backup
    createBackup: () => ipcRenderer.invoke('hosts:backup'),

    // Get list of backups
    getBackups: () => ipcRenderer.invoke('hosts:getBackups'),

    // Restore from backup
    restoreBackup: (backupPath) => ipcRenderer.invoke('hosts:restore', backupPath),
});

contextBridge.exposeInMainWorld('windowAPI', {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
});
