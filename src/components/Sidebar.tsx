import React, { useState } from 'react';
import { Menu, X, Settings, Home, User, MessageSquare, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/router';

interface SidebarProps {
    isHome: boolean;
    isMenuMode: boolean;
    setIsMenuMode: (isMenuMode: boolean) => void;
    currentSection: 'home' | 'settings' | 'account';
    setCurrentSection: (section: 'home' | 'settings' | 'account') => void;
    projects?: Array<{ id: string; name: string; lastMessage: string; }>;
}

const Sidebar: React.FC<SidebarProps> = ({ isHome, isMenuMode, setIsMenuMode, currentSection, setCurrentSection, projects = [] }) => {
    const { user } = useUser();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy chats for demonstration
   

    // Filter chats based on search query
    const filteredChats = projects.filter(chat => 
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
        <div className="fixed left-0 top-0 w-64 h-full bg-gray-900 shadow-xl z-50 sidebar flex flex-col text-gray-100">
            {/* Header with Search */}
            <div className="p-5 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ChatApp
                    </span>
                    <button 
                        onClick={() => setIsMenuMode(!isMenuMode)}
                        className="p-1.5 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-100 transition-colors"
                    >
                        {isMenuMode ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-800/50 text-sm rounded-lg pl-9 pr-4 py-2 border border-gray-800 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-300 placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {isMenuMode ? (
                    <div className="p-3">
                        <div className="space-y-0.5">
                            <button 
                                onClick={() => router.push('/')}
                                className="w-full p-2.5 text-left hover:bg-gray-800 rounded-lg flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors group"
                            >
                                <Home size={18} className="group-hover:text-indigo-400" /> 
                                <span className="text-sm font-medium">Home</span>
                            </button>
                            <button 
                                onClick={() => { setCurrentSection('settings'); setIsMenuMode(false); }}
                                className="w-full p-2.5 text-left hover:bg-gray-800 rounded-lg flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors group"
                            >
                                <Settings size={18} className="group-hover:text-indigo-400" /> 
                                <span className="text-sm font-medium">Settings</span>
                            </button>
                            <button 
                                onClick={() => { setCurrentSection('account'); setIsMenuMode(false); }}
                                className="w-full p-2.5 text-left hover:bg-gray-800 rounded-lg flex items-center gap-3 text-gray-300 hover:text-gray-100 transition-colors group"
                            >
                                <User size={18} className="group-hover:text-indigo-400" /> 
                                <span className="text-sm font-medium">Account</span>
                            </button>
                        </div>
                    <div className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
                        <div className="flex items-center justify-between px-2 mb-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Recent Chats
                            </h3>
                            <span className="text-xs text-gray-500">{filteredChats.length}</span>
                        </div>
                        <div className="space-y-1">
                            {filteredChats.map(chat => (
                                <button
                                    key={chat.id}
                                    onClick={() => router.push(`/chat/${chat.id}`)}
                                    className="w-full p-2.5 text-left hover:bg-gray-800/50 rounded-lg flex flex-col gap-1 text-gray-300 hover:text-gray-100 transition-all group relative"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500/50 group-hover:bg-indigo-400"></div>
                                        <span className="font-medium text-sm truncate flex-1">{chat.name}</span>
                                    </div>
                                    <span className="text-xs text-gray-500 truncate pl-5">{chat.lastMessage}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    </div>
                ) : (
                    renderContent()
                )}
            </div>

            {/* User Profile Section */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 truncate">
                            {user?.email || 'Not logged in'}
                        </div>
                        <div className="text-xs text-gray-500">Online</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;