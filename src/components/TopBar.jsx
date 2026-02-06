import React from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Save, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

function TopBar({ onAddHost }) {
    const {
        searchQuery,
        setSearchQuery,
        hasChanges,
        saveHosts,
        loadHosts,
        activeView
    } = useApp();

    const getTitle = () => {
        switch (activeView) {
            case 'all': return 'All Hosts';
            case 'disabled': return 'Disabled Entries';
            case 'settings': return 'Settings';
            default: return activeView; // Project name
        }
    };

    return (
        <div className="h-16 px-6 flex items-center justify-between border-b border-border bg-surface/50 backdrop-blur-sm">
            {/* Title */}
            <div>
                <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Search */}
                {activeView !== 'settings' && (
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search hosts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-border text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
                        />
                    </div>
                )}

                {/* Refresh */}
                <motion.button
                    onClick={loadHosts}
                    className="btn-secondary flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RefreshCw size={16} />
                </motion.button>

                {/* Save Changes */}
                {hasChanges && (
                    <motion.button
                        onClick={saveHosts}
                        className="btn-primary flex items-center gap-2"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Save size={16} />
                        <span>Apply Changes</span>
                    </motion.button>
                )}

                {/* Add Host */}
                {activeView !== 'settings' && (
                    <motion.button
                        onClick={onAddHost}
                        className="btn-primary flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Plus size={16} />
                        <span>Add Host</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
}

export default TopBar;
