import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

const toastConfig = {
    success: {
        icon: CheckCircle,
        bgClass: 'bg-success/10 border-success/30',
        iconClass: 'text-success',
    },
    error: {
        icon: XCircle,
        bgClass: 'bg-red-500/10 border-red-500/30',
        iconClass: 'text-red-500',
    },
    warning: {
        icon: AlertCircle,
        bgClass: 'bg-amber-500/10 border-amber-500/30',
        iconClass: 'text-amber-500',
    },
    info: {
        icon: Info,
        bgClass: 'bg-blue-500/10 border-blue-500/30',
        iconClass: 'text-blue-500',
    },
};

function Toast({ toast, onDismiss }) {
    const config = toastConfig[toast.type] || toastConfig.info;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm shadow-lg min-w-[300px]',
                config.bgClass
            )}
        >
            <Icon size={18} className={config.iconClass} />
            <p className="flex-1 text-sm text-body">{toast.message}</p>
            <motion.button
                onClick={() => onDismiss(toast.id)}
                className="p-1 rounded-md hover:bg-card-hover transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <X size={14} className="text-muted" />
            </motion.button>
        </motion.div>
    );
}

function ToastContainer() {
    const { toasts, dismissToast } = useApp();

    return (
        <div className="fixed bottom-6 right-6 z-[100] space-y-2">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
                ))}
            </AnimatePresence>
        </div>
    );
}

export default ToastContainer;
