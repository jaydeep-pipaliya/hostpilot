import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Edit2,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Server,
    Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

function HostCard({ host, onEdit, index }) {
    const { toggleHost, deleteHost } = useApp();

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
            className={cn(
                'card-hover group p-[10px]',
                !host.enabled && 'opacity-60'
            )}
        >
            <div className="flex items-center justify-between px-3">
                {/* Left: Host info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Icon - Smaller for compact view */}
                    <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                        host.enabled
                            ? 'bg-primary'
                            : 'bg-border'
                    )}
                        style={host.enabled ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)' } : {}}
                    >
                        <Server size={14} className="text-white" />
                    </div>

                    {/* Compact Info Strip */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="font-mono text-sm font-medium text-primary shrink-0">
                                {host.ip}
                            </span>
                            <span className="text-muted opacity-50">→</span>
                            <span className="font-medium text-body truncate max-w-[200px]">
                                {host.domain}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {host.projectTag && (
                                <span className="tag py-0.5 px-1.5 text-[10px]">
                                    <Tag size={10} className="mr-1" />
                                    {host.projectTag}
                                </span>
                            )}
                            <span className={cn(
                                'text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wider',
                                host.enabled ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
                            )}>
                                {host.enabled ? 'Active' : 'Disabled'}
                            </span>
                            {host.comment && (
                                <span className="text-xs text-muted truncate italic max-w-[150px]">
                                    - {host.comment}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Toggle */}
                    <motion.button
                        onClick={() => toggleHost(host.id)}
                        className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title={host.enabled ? 'Disable' : 'Enable'}
                    >
                        {host.enabled ? (
                            <ToggleRight size={20} className="text-green-500" />
                        ) : (
                            <ToggleLeft size={20} className="text-muted" />
                        )}
                    </motion.button>

                    {/* Edit */}
                    <motion.button
                        onClick={() => onEdit(host)}
                        className="p-2 rounded-lg hover:bg-card-hover transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Edit"
                    >
                        <Edit2 size={16} className="text-muted" />
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                        onClick={() => deleteHost(host.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Delete"
                    >
                        <Trash2 size={16} className="text-red-500" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
        >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                <Globe size={48} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-body mb-2">No hosts found</h3>
            <p className="text-muted text-center max-w-md">
                There are no host entries matching your criteria.
                Click the "Add Host" button to create a new entry.
            </p>
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="card p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl skeleton" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-48 skeleton rounded" />
                            <div className="h-3 w-32 skeleton rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function HostList({ onEditHost }) {
    const { filteredHosts, isLoading } = useApp();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (filteredHosts.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div layout className="space-y-3">
            <AnimatePresence mode="popLayout">
                {filteredHosts.map((host, index) => (
                    <HostCard
                        key={host.id}
                        host={host}
                        onEdit={onEditHost}
                        index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

export default HostList;
