import React, { useEffect, useState } from 'react';
import { Newspaper, Feather, Coffee, BookOpen, ArrowRight, Clock, MessageSquare } from 'lucide-react';
import { useProject } from '../contexts/ProjectContext';
import { useRouter } from 'next/router';

interface HomeProps {
    setIsModalOpen: (isOpen: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ setIsModalOpen }) => {
    const { project, setProject } = useProject();
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/project/all');
                const data = await response.json();
                setProject(data.projects || []);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            }
        };

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
        
        fetchProjects();
    }, []);

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
                    <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">MANAGE YOUR IMAGINATIONS</h1>
                    <div className="text-sm text-gray-500 font-serif italic">Est. 2024</div>
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

                                <button className="w-full px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-serif">
                                    Import Archive
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Project Cards */}
                <div className="max-w-4xl mx-auto mt-12">
                    <div className="border-b-2 border-gray-900 mb-6">
                        <h2 className="font-serif text-2xl font-bold text-gray-900 pb-2">Latest Chronicles</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.map((chat: any) => (
                            <article 
                                key={chat.id}
                                className="bg-white p-6 rounded-lg border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="font-serif text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                                            {chat.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-serif italic line-clamp-2">
                                            {chat.messages.length > 0 ? chat.messages[0].content : "No messages yet"}
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => router.push(`/chat/${chat.id}`)}
                                        className="ml-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <ArrowRight size={20} className="text-gray-400 hover:text-gray-600" />
                                    </button>
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
                        <div className="font-serif italic text-sm">Quality Conversations Since 2024</div>
                        <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        <div className="font-serif italic text-sm">All Rights Reserved</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home; 