import React from 'react';
import { motion } from 'framer-motion';
import {
    Globe,
    FolderOpen,
    EyeOff,
    Settings as SettingsIcon,
    Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const navItems = [
    { id: 'all', label: 'All Hosts', icon: Globe },
    { id: 'disabled', label: 'Disabled', icon: EyeOff },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function Sidebar() {
    const { activeView, setActiveView, projects, hosts } = useApp();

    const getHostCount = (view) => {
        if (view === 'all') return hosts.length;
        if (view === 'disabled') return hosts.filter(h => !h.enabled).length;
        return hosts.filter(h => h.projectTag === view).length;
    };

    return (
        <aside className="w-64 bg-surface border-r border-border flex flex-col">
            {/* Logo Section */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <img src="/src/assets/logo.svg" alt="HostPilot" className="w-10 h-10 text-accent group-hover:scale-110 transition-transform" />
                    <div>
                        <h1 className="font-bold text-lg text-white">HostPilot <span className="text-zinc-500 font-normal">by Jp</span></h1>
                        <p className="text-xs text-zinc-500">Hosts Manager</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="mb-4">
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3">
                        Navigation
                    </span>
                </div>

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    const count = item.id !== 'settings' ? getHostCount(item.id) : null;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={cn(
                                'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-gradient-primary text-white shadow-glow'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            )}
                            whileHover={{ x: isActive ? 0 : 4 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </div>
                            {count !== null && (
                                <span className={cn(
                                    'text-xs px-2 py-0.5 rounded-md',
                                    isActive ? 'bg-white/20' : 'bg-white/5'
                                )}>
                                    {count}
                                </span>
                            )}
                        </motion.button>
                    );
                })}

                {/* Projects Section */}
                {projects.length > 0 && (
                    <>
                        <div className="mt-6 mb-4">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 flex items-center gap-2">
                                <FolderOpen size={12} />
                                Projects
                            </span>
                        </div>

                        {projects.map((project) => {
                            const isActive = activeView === project;
                            const count = getHostCount(project);

                            return (
                                <motion.button
                                    key={project}
                                    onClick={() => setActiveView(project)}
                                    className={cn(
                                        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-gradient-secondary text-white'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                    )}
                                    whileHover={{ x: isActive ? 0 : 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Layers size={18} />
                                        <span>{project}</span>
                                    </div>
                                    <span className={cn(
                                        'text-xs px-2 py-0.5 rounded-md',
                                        isActive ? 'bg-white/20' : 'bg-white/5'
                                    )}>
                                        {count}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </>
                )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <div className="glass rounded-xl p-3">
                    <p className="text-xs text-zinc-500 text-center">
                        Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-zinc-400">Ctrl+N</kbd> to add host
                    </p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
