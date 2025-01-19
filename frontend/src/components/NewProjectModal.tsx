import React, { useState } from 'react';
import { X, Feather, Users, Globe, Sparkle } from 'lucide-react';

interface Collaborator {
    email: string;
}

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateProject: (projectName: string) => Promise<{ project_id: string }>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreateProject }) => {
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await onCreateProject(projectName);
            onClose();
        } catch (err) {
            setError('Failed to create chronicle');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#F6F5F0] rounded-lg shadow-xl w-full max-w-md p-8 border border-gray-200">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                        <Sparkle className="mx-4 text-gray-400" size={24} />
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                    </div>
                    <h2 className="font-sans text-2xl font-bold text-gray-900">Begin New Imagination</h2>
                    <p className="text-sm text-gray-500 font-sans italic mt-1">Dream up your next great idea</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-sans font-medium text-gray-700 mb-2">
                            Imagination Title
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 font-sans focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                            placeholder="Enter a title for your imagination"
                            required
                        />
                    </div>


                

                    {error && (
                        <p className="text-red-600 text-sm font-sans italic text-center">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-sans transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Dream It!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProjectModal; 