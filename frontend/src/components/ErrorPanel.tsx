import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

export interface Error {
    id: string;
    message: string;
    timestamp: number;
}

interface ErrorPanelProps {
    errors: Error[];
    onClearAll: () => void;
    onDismiss: (id: string) => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void;
}

const ErrorPanel: React.FC<ErrorPanelProps> = ({ 
    errors, 
    onClearAll, 
    onDismiss, 
    isVisible, 
    setIsVisible 
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Handle mouse wheel scrolling
    const handleWheel = (e: WheelEvent) => {
        if (scrollRef.current) {
            const isAtTop = scrollRef.current.scrollTop === 0;
            const isAtBottom = scrollRef.current.scrollTop + scrollRef.current.clientHeight === scrollRef.current.scrollHeight;
            
            // If we're not at boundaries or scrolling away from them, prevent default and stop propagation
            if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            scrollRef.current.scrollTop += e.deltaY;
        }
    };

    // Add a handler for the entire error panel
    const handlePanelWheel = (e: React.WheelEvent) => {
        e.stopPropagation();  // Stop wheel events from reaching the Whiteboard
    };

    useEffect(() => {
        const currentRef = scrollRef.current;
        if (currentRef) {
            currentRef.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    if (!isVisible) {
        return (
            <button
                onClick={() => setIsVisible(true)}
                className="fixed bottom-4 right-40 bg-red-50 text-red-600 p-2 rounded-lg shadow-lg hover:bg-red-100 transition-colors z-[51] flex items-center gap-2"
            >
                <AlertCircle size={20} />
                {errors.length > 0 && (
                    <span className="font-medium">Show Errors ({errors.length})</span>
                )}
            </button>
        );
    }

    return (
        <div 
            className="fixed bottom-0 left-48 right-0 h-48 bg-white border-t border-gray-200 shadow-lg z-[50] transition-all duration-200"
            onWheel={handlePanelWheel}
        >
            <div className="flex justify-between items-center px-4 py-2 bg-red-50 border-b border-red-100">
                <h3 className="font-medium text-red-800">Errors ({errors.length})</h3>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onClearAll}
                        className="text-red-600 hover:text-red-800 text-sm"
                    >
                        Clear all
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-red-600 hover:text-red-800 ml-2"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>
            <div 
                ref={scrollRef} 
                className="h-[152px] overflow-y-auto scroll-smooth"
            >
                {errors.map(error => (
                    <div 
                        key={error.id} 
                        className="flex justify-between items-center px-4 py-2 border-b border-gray-100 hover:bg-gray-50 group"
                    >
                        <div className="flex flex-col">
                            <span className="text-gray-700">{error.message}</span>
                            <span className="text-xs text-gray-400">
                                {new Date(error.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <button 
                            onClick={() => onDismiss(error.id)}
                            className="text-gray-400 hover:text-gray-600 ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ErrorPanel; 