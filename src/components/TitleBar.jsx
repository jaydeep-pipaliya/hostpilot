import { Minus, Square, X } from 'lucide-react';
import logo from '../assets/logo.svg';

function TitleBar() {
    const handleMinimize = () => window.windowAPI?.minimize();
    const handleMaximize = () => window.windowAPI?.maximize();
    const handleClose = () => window.windowAPI?.close();

    return (
        <div className="h-8 bg-card flex items-center justify-between px-4 border-b border-border titlebar-drag">
            <div className="flex items-center gap-2">
                <img src={logo} alt="" className="w-4 h-4 dark:invert-0 invert" />
                <span className="text-xs font-medium text-muted">HostPilot by Jp</span>
            </div>

            <div className="flex items-center gap-1 titlebar-no-drag">
                <button
                    onClick={handleMinimize}
                    className="w-8 h-6 flex items-center justify-center text-muted hover:text-body hover:bg-card-hover rounded transition-colors"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="w-8 h-6 flex items-center justify-center text-muted hover:text-body hover:bg-card-hover rounded transition-colors"
                >
                    <Square size={12} />
                </button>
                <button
                    onClick={handleClose}
                    className="w-8 h-6 flex items-center justify-center text-muted hover:text-white hover:bg-red-500 rounded transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default TitleBar;
