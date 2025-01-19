import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, MessageSquare, ScrollText, Boxes, Download, Image as ImageIcon } from 'lucide-react';
import ToolBar from './ToolBar';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import ModelViewer from './ModelViewer';
import ExportModal from './ExportModal';
import { usePdrStore } from '../contexts/store';
import { useIsMouseHovering } from '../contexts/IsMouseHovering';
import LoadingPage from './LoadingPage';

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
    image?: File[];
    created_at: string;
}
const Chat: React.FC<ChatProps> = ({ project, user, toolbarVisible, setToolbarVisible }) => {
    const [message, setMessage] = useState('');
    const { isMouseHovering, setIsMouseHovering } = useIsMouseHovering();
    const [attachedImages, setAttachedImages] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showChatLog, setShowChatLog] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [chatLog, setChatLog] = useState<Message[]>([]);
    const chatLogRef = useRef<HTMLDivElement>(null);

    const { worker, setWorker } = usePdrStore();

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
        if (!worker) setWorker(new Worker('/worker.js', { type: 'module' }));
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

    const handleAIResponse = async () => {
        //generate ai response
        const newMessage = {
            is_user: false,
            content: "AI response",
            created_at: new Date().toISOString(),
            image: []
        }
        setChatLog(prev => [...prev, newMessage]);
    }

    const handleImageAttachment = (files: FileList | null) => {
        if (!files) return;
        
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                setAttachedImages(prev => [...prev, file]);
            }
        });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('border-gray-400');
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-gray-400');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('border-gray-400');
        }
        handleImageAttachment(e.dataTransfer.files);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newMessage = {
                is_user: true,
                content: message,
                created_at: new Date().toISOString(),
                image: attachedImages
            };

            // Update chat log immediately
            setChatLog(prev => [...prev, newMessage]);
            setMessage(''); // Clear input
            setAttachedImages([]); // Clear attached images

            const formData = new FormData();
            formData.append('description', message);
            if (attachedImages.length > 0) {
                formData.append('image_media_type', attachedImages[0]?.type || "");
                formData.append("image_data", attachedImages[0]);
            }
            // Send to backend
            const sendMessage = async () => {
                if (project.messages.length == 0) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/initial_message/${project.id}`, {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();
                        console.log('Message received:', data);
                        // setScadCode(data);
                        const outputFile = 'ok.stl';
                        if (worker) worker.postMessage({ scadCode: data, outputFile });
                    } catch (error) {
                        console.error('Failed to send message:', error);
                    }
                } else {
                    try {
                        const response = await fetch(`http://localhost:8000/api/followup_message/${project.id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        });
                        const data = await response.json();
                        console.log('Message received:', data);
                    } catch (error) {
                        console.error('Failed to send message:', error);
                    }
                }
            };
            sendMessage();

            handleAIResponse();
        }
    };
    
    const handleExport = async (format: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/project/${project.id}/export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ format }),
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.title}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to export file:', error);
            throw error;
        }
    };

    return (
        <div className={`absolute left-[15vw] right-0 h-screen flex flex-col transition-all duration-500
            ${isMouseHovering ? 
                'bg-gradient-to-b from-[#e4edff] via-[#d5e4ff] to-[#e4edff] text-[#2d3d6d]' : 
                'bg-[#F6F5F0]'} ${toolbarVisible ? 'right-[15vw]' : 'right-0'}`}>
            {/* Chat Header */}
            <div className={`p-6 transition-colors duration-500 
                ${isMouseHovering ? 
                    'border-b-2 border-[#2d3d6d] bg-[#e4edff] shadow-lg' : 
                    'border-b-2 border-gray-900 bg-[#F6F5F0]'}`}>
                <div className="text-center">
                    <div className={`text-sm font-sans tracking-[0.3em] transition-colors duration-500
                        ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                        MAKE IT HAPPEN
                    </div>
                    <h1 className={`text-5xl font-sans font-black tracking-tight mb-2 transition-colors duration-500
                        ${isMouseHovering ? 'text-[#2d3d6d]' : 'text-gray-900'}`}>
                        {project?.title?.toUpperCase() || 'LOADING...'}
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className={`h-px w-20 transition-colors duration-500
                            ${isMouseHovering ? 'bg-blue-700' : 'bg-gray-400'}`}></div>
                        <div className={`text-xs font-sans italic transition-colors duration-500
                            ${isMouseHovering ? 'text-blue-300' : 'text-gray-500'}`}>
                            Est. 2025
                        </div>
                        <div className={`h-px w-20 transition-colors duration-500
                            ${isMouseHovering ? 'bg-blue-700' : 'bg-gray-400'}`}></div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="relative flex-1">
                {/* Canvas Area */}
                <div 
                    ref={messageAreaRef}
                    className={`absolute inset-0 overflow-y-auto space-y-4 custom-scrollbar transition-opacity duration-500
                        ${showChatLog ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <Stats parent={messageAreaRef} className="!absolute" />
                    <Canvas>
                        <ModelViewer />
                    </Canvas>
                </div>

                {/* Messages Area */}
                <div 
                    ref={chatLogRef} 
                    className={`absolute inset-0 p-6 overflow-y-auto ml-[5vw] mr-[5vw] mb-[15vh] transition-opacity duration-500
                        ${showChatLog ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    style={{ scrollbarWidth: 'none' }} 
                >
                    {chatLog.length > 0 ? (
                        <div className="flex flex-col gap-8">
                            {chatLog.map((message, index) => (
                                <div key={index} className="border-l-4 pl-6 py-2 space-y-3 hover:bg-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="font-sans font-bold text-gray-900">
                                            {message?.is_user ? 'User Entry' : 'System Response'}
                                        </span>
                                        <span className="text-sm font-sans italic text-gray-500">
                                            {new Date(message?.created_at).toLocaleTimeString('en-US', { 
                                                hour: 'numeric', 
                                                minute: '2-digit',
                                                hour12: true 
                                            })}
                                        </span>
                                    </div>
                                    <div className="font-sans text-gray-700 leading-relaxed">
                                        {message.content}
                                    </div>
                                    {message?.image && message?.image?.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {message?.image?.map((image, imgIndex) => (
                                                <div key={imgIndex} className="aspect-square overflow-hidden border border-gray-200">
                                                    <img 
                                                        src={URL.createObjectURL(image)} 
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
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <div className={`p-8 rounded-2xl backdrop-blur-sm border transition-colors duration-500
                                ${isMouseHovering ? 
                                    'bg-[#e0e8ff]/50 border-[#a5b8e3]/30 text-[#2d3d6d]' : 
                                    'bg-white/50 border-gray-200 text-gray-600'}`}>
                                <p className="text-lg font-sans">
                                    Go ahead and type in your prompt to generate your first 3D model!
                                </p>
                                <p className={`text-sm font-sans mt-2 transition-colors duration-500
                                    ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                                    Your conversation history will appear here
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Toggle ChatLog */}
            <div className="absolute bottom-6 left-[5vw] right-[5vw] flex items-end gap-4 pr-8">
                {/* Toggle Button */}
                <button 
                    onClick={() => setShowChatLog(!showChatLog)}
                    className={`h-[10vh] aspect-square backdrop-blur-sm rounded-2xl shadow-lg border transition-all duration-500
                        ${isMouseHovering ? 
                            'bg-[#e0e8ff] border-[#a5b8e3]/30 text-[#415791] hover:text-[#2d3d6d]' : 
                            'bg-white border-gray-200 text-gray-500 hover:text-gray-700'} 
                        group flex items-center justify-center flex-shrink-0`}
                    title={showChatLog ? "Hide conversation log" : "Show conversation log"}
                >   
                    {!showChatLog ? (
                        <ScrollText 
                            size={40} 
                            className="group-hover:scale-110 transition-transform" 
                        />
                    ) : (
                        <Boxes 
                            size={40} 
                            className="group-hover:scale-110 transition-transform" 
                        />
                    )}
                </button>

                {/* Input Area */}
                <div className={`min-h-[10vh] flex-1 rounded-2xl shadow-lg border p-4 transform-gpu transition-all duration-500
                    ${isMouseHovering ? 
                        'bg-[#e0e8ff] border-[#a5b8e3]/30' : 
                        'bg-white border-gray-200'}`}>
                    <div className="flex flex-col gap-2">
                        {attachedImages.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {attachedImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(image)} 
                                            alt="attachment preview" 
                                            className={`w-16 h-16 object-cover rounded-lg border transition-colors duration-500
                                                ${isMouseHovering ? 'border-blue-700/30' : 'border-gray-200'}`}
                                        />
                                        <button
                                            onClick={() => setAttachedImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex items-end gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleImageAttachment(e.target.files)}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className={`p-2 rounded-lg transition-colors duration-500
                                    ${isMouseHovering ? 
                                        'text-[#2d3d6d] hover:text-[#415791]' : 
                                        'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                            >
                                <ImageIcon size={20} />
                            </button>
                            <div 
                                ref={dropZoneRef}
                                className={`flex-1 rounded-xl border transition-colors duration-500
                                    ${isMouseHovering ? 
                                        'bg-blue-800/20 border-blue-700/30' : 
                                        'bg-white border-gray-200'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="What's your perspective?"
                                    className={`w-full p-3 font-sans resize-none overflow-hidden focus:outline-none min-h-[7vh] max-h-[30vh] bg-transparent transition-colors duration-500
                                        ${isMouseHovering ? 
                                            'text-[#2d3d6d] placeholder-[#415791]' : 
                                            'text-gray-900 placeholder-gray-400'}`}
                                    style={{ lineHeight: '1.5' }}
                                    rows={1}
                                />
                            </div>
                            <button
                                onClick={() => setIsExportModalOpen(true)}
                                className={`p-3 rounded-lg transition-colors duration-500
                                    ${isMouseHovering ? 
                                        'bg-blue-700 hover:bg-blue-600 text-blue-100' : 
                                        'bg-gray-900 text-white'}`}
                            >
                                <Download size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Send Button */}
                <button 
                    disabled={!message.trim() && attachedImages.length === 0}
                    onClick={() => {
                        if (message.trim() || attachedImages.length > 0) {
                            const event = { key: 'Enter', shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent;
                            handleKeyDown(event);
                        }
                    }}
                    onMouseEnter={() => setIsMouseHovering(true)}
                    className={`h-[10vh] w-[240px] relative overflow-hidden rounded-2xl text-white flex items-center justify-center flex-shrink-0 transition-all duration-500 origin-left
                        ${isMouseHovering ? 
                            'bg-gradient-to-r from-[#2d3d6d] via-[#415791] to-[#2d3d6d] shadow-xl shadow-blue-500/20 scale-110 border border-blue-300/30' : 
                            'bg-gray-900 shadow-lg'}
                        ${!message.trim() && attachedImages.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-blue-500/30'}`}
                    title="Make your dream come true"
                >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                    
                    {/* Button content */}
                    <div className="flex flex-col items-center gap-1">
                        <span className="font-sans tracking-[0.2em] text-sm font-medium">
                            NEW PERSPECTIVE
                        </span>
                        <div className="flex items-center gap-1 opacity-60">
                            <div className="w-1 h-[1px] bg-current" />
                            <span className="text-[10px] tracking-wider">CREATE THE MODEL</span>
                            <div className="w-1 h-[1px] bg-current" />
                        </div>
                    </div>
                </button>
            </div>

            <ExportModal 
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={handleExport}
            />
        </div>
    );
};

export default Chat;