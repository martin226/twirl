import React, { useEffect, useState } from 'react';
import { Newspaper, Feather, Coffee, BookOpen, ArrowRight, Clock, MessageSquare, Trash } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useRouter } from 'next/router';
import ImportArchiveModal from './ImportArchiveModal';

interface HomeProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsModalOpen }) => {
    const { project, setProject } = useProject();
    const router = useRouter();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; projectId: string } | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // Handle context menu
    const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, projectId });
    };

    // Handle delete project
    const handleDeleteProject = async (projectId: string) => {
        try {
            const response = await fetch(`http://localhost:8000/api/messages/${projectId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setProject(project.filter((p: any) => p.id !== projectId));
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
        setContextMenu(null);
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
    

        const newProject = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/project', {
                    method: 'POST',
                    body: JSON.stringify({ title: 'New Project' }),
                });
                const data = await response.json();
            } catch (error) {
                console.error('Failed to create new project:', error);
            }
        };
        
    }, []);

    const handleImportSTL = async (stlCode: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/project/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ stl_code: stlCode }),
            });
            const data = await response.json();
            router.push(`/chat/${data.id}`);
        } catch (error) {
            console.error('Failed to import STL:', error);
            throw error;
        }
    };

    return (
        <div className="flex-1 h-screen overflow-y-auto bg-[#F6F5F0] custom-scrollbar">
            <div className="p-8 min-h-full">
                {/* Decorative Header */}
                <div className="max-w-4xl mx-auto mb-12 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="h-px w-32 bg-gray-300 self-center"></div>
                        <Feather className="mx-4 text-gray-400" size={24} />
                        <div className="h-px w-32 bg-gray-300 self-center"></div>
                    </div>
                    <h1 className="font-serif text-5xl font-bold text-gray-900 mb-2">MANAGE YOUR IMAGINATIONS</h1>
                    <div className="text-sm text-gray-500 font-serif italic">Inspire, Imagine, Invent</div>
                    <div className="flex justify-center items-center gap-3 mt-4 text-gray-400">
                        <Coffee size={16} />
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <BookOpen size={16} />
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <Newspaper size={16} />
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Stats Card */}
                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100 hover:shadow-lg transition-all duration-200">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="font-serif text-lg text-gray-900 mb-3">Volume Statistics</h3>
                            <p className="text-6xl font-serif font-bold text-gray-900 leading-none mb-3">
                                {project?.length || 0}
                            </p>
                            <div className="text-sm text-gray-500 font-serif italic mb-4">Active Conversations</div>
                            <div className="flex justify-center items-center gap-2">
                                <div className="h-px w-12 bg-gray-200"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                                <div className="h-px w-12 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-lg shadow-md p-8 border border-gray-100">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="font-serif text-lg text-gray-900 mb-6">Editorial Actions</h3>
                            <div className="space-y-4 w-full max-w-xs">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-serif group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-300"></div>
                                    <span className="relative">Begin New Conversation</span>
                                </button>
                                
                                <div className="flex items-center gap-3 my-4">
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                    <span className="font-serif text-sm text-gray-400">or</span>
                                    <div className="h-px flex-1 bg-gray-200"></div>
                                </div>

                                <button 
                                    onClick={() => setIsImportModalOpen(true)} 
                                    className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-serif"
                                >
                                    Import Archive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Cards */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="border-b-2 border-gray-900 mb-6">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 pb-2">LATEST MODELS</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.map((chat: any) => (
                            <article 
                                key={chat.id}
                                onClick={() => router.push(`/chat/${chat.id}`)}
                                onContextMenu={(e) => handleContextMenu(e, chat.id)}
                                className="bg-white p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors">
                                            {chat.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-serif italic line-clamp-2">
                                            {chat.messages.length > 0 ? chat.messages[0].content : "No messages yet"}
                                        </p>
                                    </div>
                                    <div className="ml-4 p-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-xs text-gray-400 font-serif">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} />
                                        <span>
                                            {new Date(chat.timestamp || Date.now()).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={12} />
                                        <span>{chat.messageCount || 'New'}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {project.length === 0 && (
                        <div className="text-center py-12">
                            <div className="font-serif text-gray-400 italic">
                                No conversations yet. Begin your first chronicle above.
                            </div>
                        </div>
                    )}
                </div>

                {/* Decorative Footer */}
                <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
                    <div className="flex justify-center items-center gap-4 text-gray-400">
                        <div className="font-serif italic text-sm">Quality Conversations Since 2025</div>
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <div className="font-serif italic text-sm">All Rights Reserved</div>
                    </div>
                </div>

                {/* Context Menu */}
                {contextMenu && (
                    <div 
                        className="fixed z-50 bg-white rounded-lg shadow-lg py-1 w-48 border border-gray-200"
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProject(contextMenu.projectId);
                            }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash size={16} />
                            Delete Project
                        </button>
                    </div>
                )}
            </div>

            <ImportArchiveModal 
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportSTL}
            />
        </div>
    );
};

export default Home; 