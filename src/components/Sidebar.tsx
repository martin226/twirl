import React, { useState } from 'react';
import { Menu, X, Settings, Home, User, MessageSquare, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/router';
import { useProject } from '../contexts/ProjectContext';

interface SidebarProps {
    isHome: boolean;
    isMenuMode: boolean;
    setIsMenuMode: (isMenuMode: boolean) => void;
    currentSection: 'home' | 'settings' | 'account';
    setCurrentSection: (section: 'home' | 'settings' | 'account') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isHome, isMenuMode, setIsMenuMode, currentSection, setCurrentSection }) => {
    const { user } = useUser();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');   
    const { project, setProject } = useProject();   

    // Filter chats based on search query
    const filteredChats = project.filter((chat: any) => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderContent = () => {
        switch (currentSection) {
            case 'account':
                return (
                    <div className="space-y-4 p-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <User size={40} className="text-gray-400" />
                            </div>
                            <h3 className="font-medium text-gray-200">{user?.email || 'Not logged in'}</h3>
                        </div>
                        <div className="space-y-2 pt-4">
                            <button className="w-full p-2 text-left hover:bg-gray-800 rounded text-gray-300">
                                Profile Settings
                            </button>
                            <button className="w-full p-2 text-left text-red-400 hover:bg-gray-800 rounded">
                                Sign Out
                            </button>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-4 p-4">
                        <h3 className="font-medium text-gray-200">Settings</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-gray-300">
                                <span>Dark Mode</span>
                                <button className="p-2 bg-gray-800 rounded">On</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute left-0 top-0 w-64 h-full bg-[#F6F5F0] border-r border-gray-200 shadow-lg z-50 sidebar flex flex-col">
            {/* Header with Search */}
            <div className="p-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-serif font-bold text-gray-900">
                        The Daily Chat
                    </span>
                    <button 
                        onClick={() => setIsMenuMode(!isMenuMode)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        {isMenuMode ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900 placeholder-gray-400"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {isMenuMode ? (
                    <div className="h-full flex flex-col">
                        <div className="p-3">
                            <div className="space-y-0.5">
                                <button 
                                    onClick={() => router.push('/')}
                                    className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors group font-medium"
                                >
                                    <Home size={18} className="text-gray-500" /> 
                                    <span className="text-sm">Front Page</span>
                                </button>
                                <button 
                                    onClick={() => { setCurrentSection('settings'); setIsMenuMode(false); }}
                                    className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors group font-medium"
                                >
                                    <Settings size={18} className="text-gray-500" /> 
                                    <span className="text-sm">Settings</span>
                                </button>
                                <button 
                                    onClick={() => { setCurrentSection('account'); setIsMenuMode(false); }}
                                    className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors group font-medium"
                                >
                                    <User size={18} className="text-gray-500" /> 
                                    <span className="text-sm">Account</span>
                                </button>
                            </div>
                        </div>

                        {/* Latest Conversations */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full flex flex-col">
                                <div className="px-3 pt-4 pb-2 bg-[#F6F5F0] border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                                            Latest Conversations
                                        </h3>
                                        <span className="text-xs text-gray-500 font-medium">{filteredChats.length}</span>
                                    </div>
                                </div>

                                <div className="flex-1 custom-scrollbar px-3 py-2 overflow-y-auto">
                                    <div className="space-y-2 overflow-hidden">
                                        {filteredChats.map((chat: any) => (
                                            <button
                                                key={chat.id}
                                                onClick={() => router.push(`/chat/${chat.id}`)}
                                                className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex flex-col gap-1 transition-all group relative border border-transparent hover:border-gray-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                                    <span className="font-serif font-medium text-sm text-gray-900 truncate flex-1">
                                                        {chat.name}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 truncate pl-4 font-serif italic">
                                                    {chat.lastMessage}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    renderContent()
                )}
            </div>

            {/* User Profile Section */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white font-serif">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-serif font-medium text-gray-900 truncate">
                            {user?.email || 'Not logged in'}
                        </div>
                        <div className="text-xs text-gray-500 font-serif">Editor</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;