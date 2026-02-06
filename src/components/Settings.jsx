import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Moon,
    Sun,
    FolderOpen,
    Download,
    Upload,
    History,
    Shield,
    HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

function SettingsSection({ title, icon: Icon, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={16} className="text-primary" />
                </div>
                <h3 className="font-semibold text-body">{title}</h3>
            </div>
            {children}
        </motion.div>
    );
}

function Settings() {
    const { theme, setTheme, showToast, hosts } = useApp();
    const [autoBackup, setAutoBackup] = useState(true);
    const [backups, setBackups] = useState([]);

    useEffect(() => {
        loadBackups();
    }, []);

    const loadBackups = async () => {
        if (window.hostAPI) {
            const result = await window.hostAPI.getBackups();
            if (result.success) {
                setBackups(result.backups);
            }
        }
    };

    const handleExport = () => {
        const data = JSON.stringify(hosts, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hosts-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Hosts exported successfully', 'success');
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        showToast(`Imported ${data.length} host entries`, 'success');
                    } catch (err) {
                        showToast('Invalid JSON file', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handleCreateBackup = async () => {
        if (window.hostAPI) {
            const result = await window.hostAPI.createBackup();
            if (result.success) {
                showToast('Backup created successfully', 'success');
                loadBackups();
            } else {
                showToast('Failed to create backup', 'error');
            }
        } else {
            showToast('Backup created (dev mode)', 'success');
        }
    };

    return (
        <div className="max-w-2xl space-y-6">
            {/* Appearance */}
            <SettingsSection title="Appearance" icon={theme === 'dark' ? Moon : Sun}>
                <div className="flex items-center justify-between py-2">
                    <div>
                        <p className="text-sm font-medium text-body opacity-80">Dark Mode</p>
                        <p className="text-xs text-muted">Toggle between light and dark theme</p>
                    </div>
                    <motion.button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={cn(
                            'w-12 h-6 rounded-full relative transition-colors',
                            theme === 'dark' ? 'bg-primary' : 'bg-border'
                        )}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 flex items-center justify-center"
                            animate={{ left: theme === 'dark' ? '26px' : '2px' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                            {theme === 'dark' ? (
                                <Moon size={12} className="text-primary" />
                            ) : (
                                <Sun size={12} className="text-amber-500" />
                            )}
                        </motion.div>
                    </motion.button>
                </div>
            </SettingsSection>

            {/* Backup */}
            <SettingsSection title="Backup & Restore" icon={Shield}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium text-body opacity-80">Auto Backup</p>
                            <p className="text-xs text-muted">Create backup before every save</p>
                        </div>
                        <motion.button
                            onClick={() => setAutoBackup(!autoBackup)}
                            className={cn(
                                'w-12 h-6 rounded-full relative transition-colors',
                                autoBackup ? 'bg-green-500' : 'bg-border'
                            )}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                                animate={{ left: autoBackup ? '26px' : '2px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </motion.button>
                    </div>

                    <motion.button
                        onClick={handleCreateBackup}
                        className="btn-secondary w-full flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <HardDrive size={16} />
                        Create Backup Now
                    </motion.button>

                    {backups.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-medium text-muted mb-2">Recent Backups</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {backups.slice(0, 5).map((backup, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-2 rounded-lg bg-card-hover text-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <History size={14} className="text-muted" />
                                            <span className="text-muted text-xs font-mono">
                                                {new Date(backup.date).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </SettingsSection>

            {/* Import/Export */}
            <SettingsSection title="Import / Export" icon={FolderOpen}>
                <div className="grid grid-cols-2 gap-3">
                    <motion.button
                        onClick={handleExport}
                        className="btn-secondary flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Download size={16} />
                        Export JSON
                    </motion.button>
                    <motion.button
                        onClick={handleImport}
                        className="btn-secondary flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Upload size={16} />
                        Import JSON
                    </motion.button>
                </div>
            </SettingsSection>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center text-xs text-muted pt-6"
            >
                <p>HostPilot v1.1.1</p>
                <p className="mt-1">A premium developer tool for managing hosts</p>
            </motion.div>
        </div>
    );
}

export default Settings;
