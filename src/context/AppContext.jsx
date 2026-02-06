import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext(null);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

// Initial mock data for development without Electron
const mockHosts = [
    { id: '1', ip: '127.0.0.1', domain: 'localhost', projectTag: null, comment: '', enabled: true },
    { id: '2', ip: '127.0.0.1', domain: 'myapp.local', projectTag: 'Local Dev', comment: 'Main app', enabled: true },
    { id: '3', ip: '192.168.1.100', domain: 'api.myapp.local', projectTag: 'Local Dev', comment: 'API server', enabled: true },
    { id: '4', ip: '127.0.0.1', domain: 'staging.example.com', projectTag: 'Staging', comment: '', enabled: false },
    { id: '5', ip: '10.0.0.5', domain: 'db.internal', projectTag: 'Database', comment: 'MySQL server', enabled: true },
];

export function AppProvider({ children }) {
    const [hosts, setHosts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeView, setActiveView] = useState('all'); // 'all', 'disabled', 'settings', or project name
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasChanges, setHasChanges] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [theme, setTheme] = useState('dark');

    // Load hosts on mount
    useEffect(() => {
        loadHosts();
    }, []);

    // Extract projects from hosts
    useEffect(() => {
        const projectSet = new Set();
        hosts.forEach(host => {
            if (host.projectTag) {
                projectSet.add(host.projectTag);
            }
        });
        setProjects(Array.from(projectSet).sort());
    }, [hosts]);

    const loadHosts = async () => {
        setIsLoading(true);
        try {
            if (window.hostAPI) {
                const result = await window.hostAPI.getHosts();
                if (result.success) {
                    setHosts(result.entries);
                } else {
                    showToast('Failed to load hosts: ' + result.error, 'error');
                }
            } else {
                // Development mode without Electron
                setTimeout(() => {
                    setHosts(mockHosts);
                }, 500);
            }
        } catch (error) {
            showToast('Error loading hosts file', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const saveHosts = async () => {
        try {
            if (window.hostAPI) {
                const result = await window.hostAPI.saveHosts(hosts);
                if (result.success) {
                    showToast('Changes saved successfully!', 'success');
                    setHasChanges(false);
                } else {
                    showToast('Failed to save: ' + result.error, 'error');
                }
            } else {
                // Development mode
                showToast('Changes saved (dev mode)', 'success');
                setHasChanges(false);
            }
        } catch (error) {
            showToast('Error saving hosts file', 'error');
        }
    };

    const addHost = (hostData) => {
        const newHost = {
            id: uuidv4(),
            ...hostData,
        };
        setHosts(prev => [...prev, newHost]);
        setHasChanges(true);
        showToast('Host entry added', 'success');
    };

    const updateHost = (id, updates) => {
        setHosts(prev => prev.map(host =>
            host.id === id ? { ...host, ...updates } : host
        ));
        setHasChanges(true);
    };

    const deleteHost = (id) => {
        setHosts(prev => prev.filter(host => host.id !== id));
        setHasChanges(true);
        showToast('Host entry deleted', 'success');
    };

    const toggleHost = (id) => {
        setHosts(prev => prev.map(host =>
            host.id === id ? { ...host, enabled: !host.enabled } : host
        ));
        setHasChanges(true);
    };

    const showToast = useCallback((message, type = 'info') => {
        const id = uuidv4();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismissToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Filter hosts based on active view and search
    const filteredHosts = hosts.filter(host => {
        // Filter by view
        if (activeView === 'disabled' && host.enabled) return false;
        if (activeView !== 'all' && activeView !== 'disabled' && activeView !== 'settings') {
            if (host.projectTag !== activeView) return false;
        }

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                host.ip.toLowerCase().includes(query) ||
                host.domain.toLowerCase().includes(query) ||
                (host.projectTag && host.projectTag.toLowerCase().includes(query)) ||
                (host.comment && host.comment.toLowerCase().includes(query))
            );
        }

        return true;
    });

    const value = {
        hosts,
        filteredHosts,
        projects,
        activeView,
        setActiveView,
        searchQuery,
        setSearchQuery,
        isLoading,
        hasChanges,
        theme,
        setTheme,
        toasts,
        loadHosts,
        saveHosts,
        addHost,
        updateHost,
        deleteHost,
        toggleHost,
        showToast,
        dismissToast,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
