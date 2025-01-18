import React from 'react';
import { Newspaper, Feather, Coffee, BookOpen } from 'lucide-react';

interface HomeProps {
    setIsModalOpen: (isOpen: boolean) => void;
    projects: any[];
    setProjects: (projects: any[]) => void;
}

const Home: React.FC<HomeProps> = ({ setIsModalOpen, projects, setProjects }) => {
    return (
        <div className="flex-1 p-8 bg-[#F6F5F0] overflow-y-auto">
            {/* Decorative Header */}
            <div className="max-w-4xl mx-auto mb-12 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-px w-32 bg-gray-300 self-center"></div>
                    <Feather className="mx-4 text-gray-400" size={24} />
                    <div className="h-px w-32 bg-gray-300 self-center"></div>
                </div>
                <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">The Daily Chronicle</h1>
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
                            {projects.length}
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

            {/* Decorative Footer */}
            <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
                <div className="flex justify-center items-center gap-4 text-gray-400">
                    <div className="font-serif italic text-sm">Quality Conversations Since 2024</div>
                    <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                    <div className="font-serif italic text-sm">All Rights Reserved</div>
                </div>
            </div>
        </div>
    );
};

export default Home; 