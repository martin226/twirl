import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatProps {
    project: any;
    user: any;
}

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: Date;
    isUser: boolean;
}

const Chat: React.FC<ChatProps> = ({ project, user }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'AI Assistant',
            timestamp: new Date(Date.now() - 50000),
            isUser: false
        },
        {
            id: '2',
            text: 'I need help with my project',
            sender: 'User',
            timestamp: new Date(Date.now() - 40000),
            isUser: true
        },
        {
            id: '3',
            text: 'Sure! I\'d be happy to help. What specific aspects of your project would you like to discuss?',
            sender: 'AI Assistant',
            timestamp: new Date(Date.now() - 30000),
            isUser: false
        }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message,
                sender: user?.email || 'User',
                timestamp: new Date(),
                isUser: true
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    };

    return (
        <div className="flex-1 h-full bg-gray-900 text-gray-100 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-gray-100">
                    {project?.name || 'Loading...'}
                </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[70%] ${msg.isUser ? 'bg-indigo-600' : 'bg-gray-800'} rounded-2xl px-4 py-2`}>
                            {!msg.isUser && (
                                <div className="text-sm text-gray-400 mb-1">{msg.sender}</div>
                            )}
                            <div className="text-gray-100">{msg.text}</div>
                            <div className="text-xs text-gray-400 mt-1 text-right">
                                {formatTime(msg.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-300 transition-colors">
                        <Paperclip size={20} />
                    </button>
                    <div className="flex-1 bg-gray-800 rounded-lg border border-gray-700">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Type a message..."
                            className="w-full bg-transparent text-gray-100 p-3 max-h-32 focus:outline-none resize-none"
                            rows={1}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;