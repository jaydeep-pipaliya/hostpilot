import React from 'react';
import { Minus, Square, X } from 'lucide-react';

function TitleBar() {
    const handleMinimize = () => window.windowAPI?.minimize();
    const handleMaximize = () => window.windowAPI?.maximize();
    const handleClose = () => window.windowAPI?.close();

    return (
        <div className="h-8 bg-background flex items-center justify-between px-4 border-b border-border titlebar-drag">
            <div className="flex items-center gap-2">
                <img src="/src/assets/logo.svg" alt="" className="w-4 h-4" />
                <span className="text-xs font-medium text-zinc-400">HostPilot by Jp</span>
            </div>

            <div className="flex items-center gap-1 titlebar-no-drag">
                <button
                    onClick={handleMinimize}
                    className="w-8 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded transition-colors"
                >
                    <Minus size={14} />
                </button>
                <button
                    onClick={handleMaximize}
                    className="w-8 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded transition-colors"
                >
                    <Square size={12} />
                </button>
                <button
                    onClick={handleClose}
                    className="w-8 h-6 flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}

export default TitleBar;
