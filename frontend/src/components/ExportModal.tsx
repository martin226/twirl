import React, { useState } from 'react';
import { X, Feather, Download } from 'lucide-react';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (format: string) => Promise<void>;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport }) => {
    const [format, setFormat] = useState('stl');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onExport(format);
            onClose();
        } catch (err) {
            setError('Failed to export file');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#F6F5F0] rounded-lg shadow-xl w-full max-w-md p-8 border border-gray-200">
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                        <Feather className="mx-4 text-gray-400" size={24} />
                        <div className="h-px w-16 bg-gray-300 self-center"></div>
                    </div>
                    <h2 className="font-sans text-2xl font-bold text-gray-900">Export File</h2>
                    <p className="text-sm text-gray-500 font-sans italic mt-1">Choose your export format</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-sm font-sans font-medium text-gray-700">
                            Format
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormat('stl')}
                                className={`p-4 border-2 rounded-lg font-sans text-center transition-colors ${
                                    format === 'stl' 
                                        ? 'border-gray-900 bg-gray-900 text-white' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                STL
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('obj')}
                                className={`p-4 border-2 rounded-lg font-sans text-center transition-colors ${
                                    format === 'obj' 
                                        ? 'border-gray-900 bg-gray-900 text-white' 
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                OBJ
                            </button>
                        </div>
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
                            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-sans transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Download size={16} />
                            {isLoading ? 'Exporting...' : 'Export File'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExportModal; 