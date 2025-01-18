import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import ToolBar from './ToolBar';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import ModelViewer from './ModelViewer';

interface ChatProps {
    project: any;
    user: any;
    toolbarVisible: boolean;
}

const Chat: React.FC<ChatProps> = ({ project, user, toolbarVisible }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Auto-resize textarea as content grows
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    // Measure message area dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (messageAreaRef.current) {
                const { offsetWidth, offsetHeight } = messageAreaRef.current;
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight
                });
                console.log('Message Area Dimensions:', { width: offsetWidth, height: offsetHeight });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Handle send message
        }
    };

    return (
        <div className={`absolute left-[15vw] right-0 h-screen bg-[#F6F5F0] flex flex-col ${toolbarVisible ? 'right-[15vw]' : 'right-0'}`}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                    {project?.name || 'Loading...'}
                </h2>
            </div>

            {/* Messages Area */}
            <div 
                ref={messageAreaRef}
                className="relative flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar border-8 border-red-500"
            >
                <Stats parent={messageAreaRef} className="!absolute" />
                <Canvas>
                    <ModelViewer />
                </Canvas>
               {/* width: {dimensions.width} <br />
               height: {dimensions.height} */}
            </div>

            {/* Floating Input Area */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4">
                    <div className="flex items-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-white rounded-xl border border-gray-200">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write your message..."
                                className="w-full bg-transparent text-gray-900 p-3 font-serif resize-none overflow-hidden focus:outline-none min-h-[44px] max-h-[200px]"
                                style={{ lineHeight: '1.5' }}
                                rows={1}
                            />
                        </div>
                        <button
                            className={`p-3 bg-gray-900 rounded-lg text-white transition-colors ${
                                !message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                            }`}
                            disabled={!message.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;