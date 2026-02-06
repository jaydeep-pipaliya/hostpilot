import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import HostList from './components/HostList';
import Settings from './components/Settings';
import HostModal from './components/HostModal';
import ToastContainer from './components/ToastContainer';
import { useApp } from './context/AppContext';

function AppContent() {
    const { activeView } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHost, setEditingHost] = useState(null);

    const handleAddHost = () => {
        setEditingHost(null);
        setIsModalOpen(true);
    };

    const handleEditHost = (host) => {
        setEditingHost(host);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingHost(null);
    };

    // Keyboard shortcut: Ctrl+N to add host
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                handleAddHost();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden">
            <TitleBar />

            <div className="flex-1 flex overflow-hidden">
                <Sidebar />

                <main className="flex-1 flex flex-col overflow-hidden">
                    <TopBar onAddHost={handleAddHost} />

                    <div className="flex-1 overflow-auto p-6">
                        {activeView === 'settings' ? (
                            <Settings />
                        ) : (
                            <HostList onEditHost={handleEditHost} />
                        )}
                    </div>
                </main>
            </div>

            <HostModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                host={editingHost}
            />

            <ToastContainer />
        </div>
    );
}

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
