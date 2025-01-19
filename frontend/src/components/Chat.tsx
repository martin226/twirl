import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, MessageSquare, ScrollText, Boxes, Download, Image as ImageIcon } from 'lucide-react';
import ToolBar from './ToolBar';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import ModelViewer from './ModelViewer';
import ExportModal from './ExportModal';
import { usePdrStore, useStateStore } from '../contexts/store';

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
    const [attachedImages, setAttachedImages] = useState<File[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showChatLog, setShowChatLog] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const [chatLog, setChatLog] = useState<Message[]>([]);
    const chatLogRef = useRef<HTMLDivElement>(null);

    const { worker, setWorker } = usePdrStore();
    const { openscad, setParameters, setOpenscad } = useStateStore();

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
                // console.log("messages", project.messages);
                if (chatLog.length == 0) {
                    try {
                        const response = await fetch(`http://localhost:8000/api/initial_message/${project.id}`, {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();
                        console.log('Message received:', data);
                        // setScadCode(data);
                        const outputFile = 'ok.stl';
                        setParameters(JSON.parse(data.parameters));
                        setOpenscad(data.openscad_code);
                        if (worker) worker.postMessage({ scadCode: data.openscad_code, outputFile });
                    } catch (error) {
                        console.error('Failed to send message:', error);
                    }
                } else {
                    const newFormData = new FormData();
                    newFormData.append('instructions', message);
                    console.log("All messages", project.messages);
                    // newFormData.append('original_prompt', chatLog[0].content);
                    // newFormData.append('openscad_output', openscad);
                    if (attachedImages.length > 0) {
                        newFormData.append('image_media_type', attachedImages[0]?.type || "");
                        newFormData.append("image_data", attachedImages[0]);
                    }
                    try {
                        const response = await fetch(`http://localhost:8000/api/followup_message/${project.id}`, {
                            method: 'POST',
                            body: newFormData,
                        });
                        const data = await response.json();
                        console.log('Message received:', data);
                        const outputFile = 'mewhen.stl';
                        setParameters(JSON.parse(data.parameters));
                        setOpenscad(data.openscad_code);
                        if (worker) worker.postMessage({ scadCode: data.openscad_code, outputFile });
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
                </div>
            )}


            {/* Floating Input and Toggle Row */}
            <div className="absolute bottom-6 left-[5vw] right-[5vw] flex items-center gap-4">
                {/* Toggle Button */}
                <button 
                    onClick={() => setShowChatLog(!showChatLog)}
                    className="h-[calc(5.5vh+2.6rem)] aspect-square bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors group flex items-center justify-center flex-shrink-0"
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

                {/* Input Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-2">
                        {attachedImages.length > 0 && (
                            <div className="flex gap-2 flex-wrap">
                                {attachedImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={URL.createObjectURL(image)} 
                                            alt="attachment preview" 
                                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
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
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <ImageIcon size={20} />
                            </button>
                            <div 
                                ref={dropZoneRef}
                                className="flex-1 bg-white rounded-xl border border-gray-200 transition-colors"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Write your message... (drag and drop images here)"
                                    className="w-full bg-transparent text-gray-900 p-3 font-serif resize-none overflow-hidden focus:outline-none min-h-[5.5vh] max-h-[20vh]"
                                    style={{ lineHeight: '1.5' }}
                                    rows={1}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    if (message.trim() || attachedImages.length > 0) {
                                        const event = { key: 'Enter', shiftKey: false, preventDefault: () => {} } as React.KeyboardEvent;
                                        handleKeyDown(event);
                                    }
                                }}
                                className={`p-3 bg-gray-900 rounded-lg text-white transition-colors ${
                                    !message.trim() && attachedImages.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                }`}
                                disabled={!message.trim() && attachedImages.length === 0}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="h-[calc(5.5vh+2.6rem)] aspect-square bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 text-gray-500 hover:text-gray-700 transition-colors group flex items-center justify-center flex-shrink-0"
                    title="Export file"
                >
                    <Download 
                        size={40} 
                        className="group-hover:scale-110 transition-transform"
                    />
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