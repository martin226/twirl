import React, { useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface ProjectContextMenuProps {
    x: number;
    y: number;
    onEdit: () => void;
    onDelete: () => void;
    onClose: () => void;
}

const ProjectContextMenu: React.FC<ProjectContextMenuProps> = ({ x, y, onEdit, onDelete, onClose }) => {
    // Close menu when clicking outside
    useEffect(() => {
        const handleClick = () => onClose();
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [onClose]);

    // Prevent menu from going off-screen
    const menuStyle = {
        top: Math.min(y - 32, window.innerHeight - 100),//subtract 32px to account for the menu padding
        left: Math.min(x, window.innerWidth - 200),  
    };

    return (
        <div 
            className="fixed z-50 bg-white rounded-lg shadow-lg py-2 w-48"
            style={menuStyle}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside
        >
            <button 
                onClick={onEdit}
                className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100"
            >
                <Edit size={16} />
                Edit Project
            </button>
            <button 
                onClick={onDelete}
                className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-red-50"
            >
                <Trash2 size={16} />
                Delete Project
            </button>
        </div>
    );
};

export default ProjectContextMenu; 