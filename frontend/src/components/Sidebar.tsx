import React, { useEffect, useState } from 'react';
import { Menu, X, Settings, Home, User, MessageSquare, Search } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/router';
import { useProject } from '../contexts/ProjectContext';
import { useIsMouseHovering } from '../contexts/IsMouseHovering';

interface SidebarProps {
    isHome: boolean;
    isMenuMode: boolean;
    setIsMenuMode: (isMenuMode: boolean) => void;
    currentSection: 'home' | 'settings' | 'account';
    setCurrentSection: (section: 'home' | 'settings' | 'account') => void;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isHome, isMenuMode, setIsMenuMode, currentSection, setCurrentSection, setIsAuthenticated }) => {
    const { user } = useUser();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');   
    const { project, setProject } = useProject();   
    const { isMouseHovering } = useIsMouseHovering();

    const handleSignOut = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        // router.push('/login');
    };

    // Filter chats based on search query
    const filteredChats = project.filter((chat: any) => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.messages.some((message: any) => message.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/project/all');
                const data = await response.json();
                console.log("All projects: ", data.projects);
                setProject(data.projects || []);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };
        fetchProjects();
    }, []);

    const renderContent = () => {
        switch (currentSection) {
            case 'account':
                return (
                    <div className="space-y-4 p-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                                <User size={40} className="text-gray-500" />
                            </div>
                            <h3 className="font-medium text-gray-900 font-sans">{user?.email || 'Not logged in'}</h3>
                        </div>
                        <div className="space-y-2 pt-4">
                            <button className="w-full p-2 text-left hover:bg-gray-100 rounded text-gray-700 font-sans">
                                Profile Settings
                            </button>
                            <button 
                                onClick={handleSignOut}
                                className="w-full p-2 text-left text-red-600 hover:bg-gray-100 rounded font-sans"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="space-y-4 p-4">
                        <h3 className="font-medium text-gray-900 font-sans">Settings</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-gray-700">
                                <span className="font-sans">Dark Mode</span>
                                <button className="p-2 bg-gray-100 rounded font-sans">Off</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="space-y-4 p-4">
                        <h3 className="font-medium text-gray-900 font-sans">Settings</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-gray-700">
                                <span className="font-sans">Dark Mode</span>
                                <button className="p-2 bg-gray-100 rounded font-sans">On</button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`absolute left-0 top-0 w-[15vw] h-full border-r shadow-lg z-50 sidebar flex flex-col
            transition-all duration-500
            ${isMouseHovering ? 
                'bg-gradient-to-b from-[#e4edff] via-[#d5e4ff] to-[#e4edff] border-[#a5b8e3]/30 text-[#415791]' : 
                'bg-[#F6F5F0] border-gray-200'
            }`}>
            {/* Header */}
            <div className={`p-5 border-b-2 transition-colors duration-500 
                ${isMouseHovering ? 'border-[#2d3d6d]' : 'border-gray-900'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className={`text-xs font-['Cinzel'] tracking-[0.2em] transition-colors duration-500
                            ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                            Twirl
                        </div>
                        <span className={`text-2xl font-sans font-bold transition-colors duration-500
                            ${isMouseHovering ? 'text-[#2d3d6d]' : 'text-gray-900'}`}>
                            OPTIONS
                        </span>
                    </div>
                    <button 
                        onClick={() => setIsMenuMode(!isMenuMode)}
                        className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                    >
                        <Menu size={20} className={`transition-colors duration-500
                            ${isMouseHovering ? 'text-[#415791]' : 'text-gray-600'}`} />
                    </button>
                </div>
                
                <div className="relative">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-500
                        ${isMouseHovering ? 'text-blue-400' : 'text-gray-400'}`} size={16} />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full text-sm rounded-lg pl-9 pr-4 py-2 font-sans transition-colors duration-500
                            ${isMouseHovering ? 
                                'bg-[#87ceeb]/50 border-[#4682b4]/30 text-[#2d3d6d] placeholder-[#4682b4] focus:ring-[#4682b4]' : 
                                'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-gray-400'}`}
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
                                    <span className="text-sm font-sans">Home</span>
                                </button>
                                <button 
                                    onClick={() => { setCurrentSection('settings'); setIsMenuMode(false); }}
                                    className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors group font-medium"
                                >
                                    <Settings size={18} className="text-gray-500" /> 
                                    <span className="text-sm font-sans">Settings</span>
                                </button>
                                <button 
                                    onClick={() => { setCurrentSection('account'); setIsMenuMode(false); }}
                                    className="w-full p-2.5 text-left hover:bg-gray-100 rounded-lg flex items-center gap-3 text-gray-700 transition-colors group font-medium"
                                >
                                    <User size={18} className="text-gray-500" /> 
                                    <span className="text-sm font-sans">Account</span>
                                </button>
                            </div>
                        </div>

                        {/* Latest Conversations */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full flex flex-col">
                                <div className={`px-3 pt-4 pb-2 border-b transition-colors duration-500
                                    ${isMouseHovering ? 
                                        'bg-[#e4edff] border-[#a5b8e3]/30' : 
                                        'bg-[#F6F5F0] border-gray-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors duration-500
                                            ${isMouseHovering ? 'text-[#2d3d6d]' : 'text-gray-900'}`}>
                                            Latest Conversations
                                        </h3>
                                        <span className={`text-xs font-medium transition-colors duration-500
                                            ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                                            {filteredChats.length}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 custom-scrollbar px-3 py-2 overflow-y-auto">
                                    <div className="space-y-2 overflow-hidden">
                                        {filteredChats.reverse().map((chat: any) => (
                                            <button
                                                key={chat.id}
                                                onClick={() => router.push(`/chat/${chat.id}`)}
                                                className={`w-full p-2.5 text-left rounded-lg flex flex-col gap-1 transition-all group relative border border-transparent
                                                    ${isMouseHovering ? 
                                                        'hover:bg-blue-800/30 hover:border-blue-700/30' : 
                                                        'hover:bg-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-1 h-1 rounded-full transition-colors duration-500
                                                        ${isMouseHovering ? 'bg-blue-600' : 'bg-gray-400'}`}></div>
                                                    <span className={`font-sans font-medium text-sm truncate flex-1 transition-colors duration-500
                                                        ${isMouseHovering ? 'text-blue-800' : 'text-gray-900'}`}>
                                                        {chat.title}
                                                    </span>
                                                </div>
                                                <span className={`text-xs truncate pl-4 font-sans italic transition-colors duration-500
                                                    ${isMouseHovering ? 'text-blue-300' : 'text-gray-500'}`}>
                                                    {chat.messages.length > 0 ? chat.messages[0].content : "No messages yet"}
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
            <div className={`p-4 border-t transition-colors duration-500
                ${isMouseHovering ? 
                    'bg-[#e4edff] border-[#a5b8e3]/30' : 
                    'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-3 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans transition-colors duration-500
                        ${isMouseHovering ? 
                            'bg-[#415791] text-[#e8e0ff]' : 
                            'bg-gray-900 text-white'}`}>
                        {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className={`text-sm font-sans font-medium truncate transition-colors duration-500
                            ${isMouseHovering ? 'text-[#2d3d6d]' : 'text-gray-900'}`}>
                            {user?.email || 'Not logged in'}
                        </div>
                        <div className={`text-xs font-sans transition-colors duration-500
                            ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                            Editor
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;