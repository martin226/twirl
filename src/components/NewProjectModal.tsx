import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Collaborator {
    email: string;
}

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateProject: (projectName: string, collaborators: Collaborator[], isPublic: boolean) => Promise<{ project_id: string }>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onCreateProject }) => {
    const [projectName, setProjectName] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onCreateProject(projectName, collaborators, isPublic);
            onClose();
        } catch (err) {
            setError('Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    const addCollaborator = () => {
        if (collaboratorEmail && !collaborators.find(c => c.email === collaboratorEmail)) {
            setCollaborators([...collaborators, { email: collaboratorEmail }]);
            setCollaboratorEmail('');
        }
    };

    const removeCollaborator = (email: string) => {
        setCollaborators(collaborators.filter(c => c.email !== email));
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-100">Create New Chat</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Chat Name
                        </label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500"
                            placeholder="Enter chat name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Add Collaborators
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={collaboratorEmail}
                                onChange={(e) => setCollaboratorEmail(e.target.value)}
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:border-indigo-500"
                                placeholder="Enter email"
                            />
                            <button
                                type="button"
                                onClick={addCollaborator}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {collaborators.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {collaborators.map(collaborator => (
                                <span
                                    key={collaborator.email}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
                                >
                                    {collaborator.email}
                                    <button
                                        type="button"
                                        onClick={() => removeCollaborator(collaborator.email)}
                                        className="text-gray-400 hover:text-gray-300"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isPublic" className="text-sm text-gray-300">
                            Make this chat public
                        </label>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Create Chat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewProjectModal; 