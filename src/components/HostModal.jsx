import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { validateIP, validateDomain, cn } from '../lib/utils';

function HostModal({ isOpen, onClose, host }) {
    const { addHost, updateHost, projects, hosts, showToast } = useApp();
    const isEditing = !!host;

    const [formData, setFormData] = useState({
        ip: '',
        domain: '',
        projectTag: '',
        comment: '',
        enabled: true,
    });

    const [errors, setErrors] = useState({});
    const [newProject, setNewProject] = useState('');
    const [isCreatingProject, setIsCreatingProject] = useState(false);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (host) {
                setFormData({
                    ip: host.ip,
                    domain: host.domain,
                    projectTag: host.projectTag || '',
                    comment: host.comment || '',
                    enabled: host.enabled,
                });
            } else {
                setFormData({
                    ip: '',
                    domain: '',
                    projectTag: '',
                    comment: '',
                    enabled: true,
                });
            }
            setErrors({});
            setNewProject('');
            setIsCreatingProject(false);
        }
    }, [isOpen, host]);

    const validate = () => {
        const newErrors = {};

        if (!formData.ip) {
            newErrors.ip = 'IP address is required';
        } else if (!validateIP(formData.ip)) {
            newErrors.ip = 'Invalid IP address format';
        }

        if (!formData.domain) {
            newErrors.domain = 'Domain is required';
        } else if (!validateDomain(formData.domain)) {
            newErrors.domain = 'Invalid domain format';
        }

        // Check for duplicate domain
        const existingHost = hosts.find(h =>
            h.domain.toLowerCase() === formData.domain.toLowerCase() && h.id !== host?.id
        );
        if (existingHost) {
            newErrors.domain = 'This domain already exists';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) return;

        const hostData = {
            ip: formData.ip.trim(),
            domain: formData.domain.trim().toLowerCase(),
            projectTag: isCreatingProject ? newProject.trim() : formData.projectTag || null,
            comment: formData.comment.trim(),
            enabled: formData.enabled,
        };

        if (isEditing) {
            updateHost(host.id, hostData);
            showToast('Host entry updated', 'success');
        } else {
            addHost(hostData);
        }

        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', duration: 0.3 }}
                        className="fixed left-1/2 top-[10%] -translate-x-1/2 w-full max-w-lg z-50"
                    >
                        <div className="glass rounded-2xl shadow-glass overflow-hidden mx-4">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h3 className="text-lg font-semibold text-white">
                                    {isEditing ? 'Edit Host Entry' : 'Add New Host'}
                                </h3>
                                <motion.button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <X size={18} className="text-zinc-400" />
                                </motion.button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* IP Address */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        IP Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ip}
                                        onChange={(e) => handleChange('ip', e.target.value)}
                                        placeholder="127.0.0.1"
                                        className={cn(
                                            'input-field font-mono',
                                            errors.ip && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        )}
                                    />
                                    {errors.ip && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 text-sm text-red-400 flex items-center gap-1"
                                        >
                                            <AlertCircle size={14} />
                                            {errors.ip}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Domain */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Domain Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.domain}
                                        onChange={(e) => handleChange('domain', e.target.value)}
                                        placeholder="myapp.local"
                                        className={cn(
                                            'input-field',
                                            errors.domain && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                        )}
                                    />
                                    {errors.domain && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-2 text-sm text-red-400 flex items-center gap-1"
                                        >
                                            <AlertCircle size={14} />
                                            {errors.domain}
                                        </motion.p>
                                    )}
                                </div>

                                {/* Project Tag */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Project Tag
                                    </label>
                                    {isCreatingProject ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newProject}
                                                onChange={(e) => setNewProject(e.target.value)}
                                                placeholder="New project name..."
                                                className="input-field flex-1"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingProject(false)}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <select
                                                value={formData.projectTag}
                                                onChange={(e) => handleChange('projectTag', e.target.value)}
                                                className="input-field flex-1"
                                            >
                                                <option value="">No project</option>
                                                {projects.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setIsCreatingProject(true)}
                                                className="btn-secondary"
                                            >
                                                New
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Comment */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Comment
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.comment}
                                        onChange={(e) => handleChange('comment', e.target.value)}
                                        placeholder="Optional description..."
                                        className="input-field"
                                    />
                                </div>

                                {/* Enabled Toggle */}
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="text-sm font-medium text-zinc-300">Enable Entry</p>
                                        <p className="text-xs text-zinc-500">Disabled entries are commented out</p>
                                    </div>
                                    <motion.button
                                        type="button"
                                        onClick={() => handleChange('enabled', !formData.enabled)}
                                        className={cn(
                                            'w-12 h-6 rounded-full relative transition-colors',
                                            formData.enabled ? 'bg-success' : 'bg-zinc-600'
                                        )}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <motion.div
                                            className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                                            animate={{ left: formData.enabled ? '26px' : '2px' }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </motion.button>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-border">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="btn-secondary flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        className="btn-primary flex-1 flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Check size={16} />
                                        {isEditing ? 'Save Changes' : 'Add Host'}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default HostModal;
