import React from 'react';
import { Bold, Italic, List, Link, Image, Code, Quote, ChevronRight, ChevronLeft } from 'lucide-react';

interface ToolBarProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

const ToolBar: React.FC<ToolBarProps> = ({ isVisible, setIsVisible }) => {
    return isVisible ? (
        <div className="absolute right-0 top-0 w-[15vw] h-full bg-[#F6F5F0] border-l border-gray-200 shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                    Formatting
                </h2>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                    title="Minimize toolbar"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Tools Section */}
            <div className="p-4 space-y-4">
                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Text Style
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Bold size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Bold</span>
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Italic size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Italic</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Insert
                    </h3>
                    <div className="space-y-1">
                        <button className="w-full p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <List size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">List</span>
                        </button>
                        <button className="w-full p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Link size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Link</span>
                        </button>
                        <button className="w-full p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Image size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Image</span>
                        </button>
                        <button className="w-full p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Code size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Code</span>
                        </button>
                        <button className="w-full p-2.5 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-700 transition-colors">
                            <Quote size={18} className="text-gray-500" />
                            <span className="text-sm font-serif">Quote</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-auto p-4 bg-white border-t border-gray-200">
                <div className="text-xs text-gray-500 font-serif italic">
                    Tip: Use Markdown syntax for quick formatting
                </div>
            </div>
        </div>
    ) : (
        <button 
            onClick={() => setIsVisible(true)}
            className="absolute right-0 top-4 p-2 bg-[#F6F5F0] border-l border-t border-b border-gray-200 rounded-l-lg shadow-lg text-gray-500 hover:text-gray-700 transition-colors z-50"
            title="Show toolbar"
        >
            <ChevronLeft size={20} />
        </button>
    );
};

export default ToolBar;
