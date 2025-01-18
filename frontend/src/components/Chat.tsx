import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, MessageSquare, ScrollText, Boxes } from 'lucide-react';
import ToolBar from './ToolBar';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import ModelViewer from './ModelViewer';

const Stats = dynamic(() => import('@react-three/drei').then((mod) => mod.Stats), {
    ssr: false
});

interface ChatProps {
    project: any;
    user: any;
    toolbarVisible: boolean;
    setToolbarVisible: (visible: boolean) => void;
}

interface Message {
    is_user: boolean;
    content: string;
    image?: string[];
    created_at: string;
}
const Chat: React.FC<ChatProps> = ({ project, user, toolbarVisible, setToolbarVisible }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showChatLog, setShowChatLog] = useState(false);

    const [chatLog, setChatLog] = useState<Message[]>([]);
    const chatLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (project?.messages) {
            const messagesWithImages = project.messages.map((msg: { is_user: boolean; content: string; created_at: string }) => ({
                ...msg,
                image: [] // Add empty image array to each message
            }));
            setChatLog(messagesWithImages);
        }
        console.log(project?.messages);
    }, [project]);

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
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Auto-scroll when messages update
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatLog, showChatLog]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newMessage = {
                is_user: true,
                content: message,
                created_at: new Date().toISOString(),
                image: []
            };

            // Update chat log immediately
            setChatLog(prev => [...prev, newMessage]);
            setMessage(''); // Clear input

            // Send to backend
            const sendMessage = async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ ...newMessage, project_id: project.id }),
                    });
                    const data = await response.json();
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            };
            sendMessage();
        }
    };
    

    return (
        <div className={`absolute left-[15vw] right-0 h-screen bg-[#F6F5F0] flex flex-col ${toolbarVisible ? 'right-[15vw]' : 'right-0'}`}>
            {/* Chat Header */}
            <div className="p-6 border-b-2 border-gray-900 bg-[#F6F5F0]">
                <div className="text-center">
                    <div className="text-sm font-serif tracking-[0.3em] text-gray-500 mb-1">MAKE IT HAPPEN</div>
                    <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tight mb-2">
                        {!showChatLog ? project?.title?.toUpperCase() || 'LOADING...' : 'ACTIVITIES'}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-20 bg-gray-400"></div>
                        <div className="text-xs font-serif italic text-gray-500">Est. 2025</div>
                        <div className="h-px w-20 bg-gray-400"></div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            {!showChatLog && <div 
                ref={messageAreaRef}
                className="relative flex-1 overflow-y-auto space-y-4 custom-scrollbar"
            >
                <Stats parent={messageAreaRef} className="!absolute" />
                <Canvas>
                    <ModelViewer />
                </Canvas>
               {/* width: {dimensions.width} <br />
               height: {dimensions.height} */}
            </div>  
            }

            {/* Floating Toggle ChatLog */}
            {showChatLog && (
                <div ref={chatLogRef} className="flex-1 p-6 overflow-y-auto ml-[5vw] mr-[5vw] mb-[15vh]"
                    style={{ scrollbarWidth: 'none' }} 
                >
                    <div className="flex flex-col gap-8">
                        {chatLog.map((message, index) => (
                            <div key={index} className="border-l-4 pl-6 py-2 space-y-3 hover:bg-white transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="font-serif font-bold text-gray-900">
                                        {message?.is_user ? 'User Entry' : 'System Response'}
                                    </span>
                                    <span className="text-sm font-serif italic text-gray-500">
                                        {new Date(message?.created_at).toLocaleTimeString('en-US', { 
                                            hour: 'numeric', 
                                            minute: '2-digit',
                                            hour12: true 
                                        })}
                                    </span>
                                </div>
                                <div className="font-serif text-gray-700 leading-relaxed">
                                    {message.content}
                                </div>
                                {message?.image && message?.image?.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4 mt-4">
                                        {message?.image?.map((image, imgIndex) => (
                                            <div key={imgIndex} className="aspect-square overflow-hidden border border-gray-200">
                                                <img 
                                                    src={image} 
                                                    alt="log attachment" 
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/* Floating ChatLog Toggle */}
            <button 
                onClick={() => setShowChatLog(!showChatLog)}
                className="absolute bottom-6 left-[5vw] w-[5.5vw] h-[calc(5.5vh+2.6rem)] bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors group flex items-center justify-center"
                title={showChatLog ? "Hide conversation log" : "Show conversation log"}
            >   
                {!showChatLog ? <ScrollText 
                    size={40} 
                    className="group-hover:scale-110 transition-transform" 
                /> : <Boxes 
                    size={40} 
                    className="group-hover:scale-110 transition-transform" 
                />}
            </button>

            {/* Floating Input Area */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[50vw] max-w-4xl">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
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
                                className="w-full bg-transparent text-gray-900 p-3 font-serif resize-none overflow-hidden focus:outline-none min-h-[5.5vh] max-h-[20vh]"
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