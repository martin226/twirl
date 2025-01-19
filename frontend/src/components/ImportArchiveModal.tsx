import React, { useState } from 'react';
import { X, Feather, Upload } from 'lucide-react';

interface ImportArchiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (stlCode: string) => Promise<void>;
}

const ImportArchiveModal: React.FC<ImportArchiveModalProps> = ({ isOpen, onClose, onImport }) => {
    const [stlCode, setStlCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onImport(stlCode);
            onClose();
        } catch (err) {
            setError('Failed to import STL code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#F6F5F0] rounded-lg shadow-xl w-full max-w-2xl p-8 border border-gray-200">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                        <Feather className="mx-4 text-gray-400" size={24} />
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                    </div>
                    <h2 className="font-sans text-2xl font-bold text-gray-900">Import STL Code</h2>
                    <p className="text-sm text-gray-500 font-sans italic mt-1">Paste your STL code below</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <textarea
                            value={stlCode}
                            onChange={(e) => setStlCode(e.target.value)}
                            className="w-full h-64 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 resize-none"
                            placeholder="Paste your STL code here..."
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
                            disabled={isLoading || !stlCode.trim()}
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Upload size={16} />
                            {isLoading ? 'Importing...' : 'Import STL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ImportArchiveModal; 