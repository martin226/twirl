import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { deleteProject, newProject } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { fetchAllProjects } from '../services/api';
import { Globe, Lock, Users } from 'lucide-react';
import ProjectContextMenu from './ProjectContextMenu';

interface HomeProps {
    setIsModalOpen: (isModalOpen: boolean) => void;
    projects: any[];
    setProjects: React.Dispatch<React.SetStateAction<any[]>>;
}

interface ContextMenu {
    show: boolean;
    x: number;
    y: number;
    projectId: string;
}

const Home: React.FC<HomeProps> = ({ setIsModalOpen, projects, setProjects }) => {
    const { user } = useUser();
    const router = useRouter();
    const [contextMenu, setContextMenu] = useState<ContextMenu>({
        show: false,
        x: 0,
        y: 0,
        projectId: ''
    });

    useEffect(() => {
        if (user) {
            fetchAllProjects(user.id).then(projects => {
                setProjects(projects);
            });
        }
    }, [user]);

    const handleProjectClick = (projectId: string) => {
        router.push(`/Chat/${projectId}`);
    };

    //right click project panel to open context menu
    const handleContextMenu = (e: React.MouseEvent, projectId: string) => {
        e.preventDefault();
        setContextMenu({
            show: true,
            x: e.pageX,
            y: e.pageY,
            projectId
        });
    };

    const handleEditProject = () => {
        setContextMenu({ ...contextMenu, show: false });
    };

    const handleDeleteProject = async () => {
        try {
            await deleteProject(contextMenu.projectId);
            setProjects(prevProjects => prevProjects.filter((project: any) => project.id !== contextMenu.projectId));
            setContextMenu({ ...contextMenu, show: false });
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    return (
        <div className="w-full h-full bg-gray-900 p-8 overflow-y-auto max-h-screen text-gray-100">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Welcome Section */}
                <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
                    <h1 className="text-2xl font-bold text-gray-100 mb-2">Welcome to Node Editor</h1>
                    <p className="text-gray-400">Create and manage your node-based workflows</p>
                </div>

                {/* Recent Projects and Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 hover:shadow-lg transition-all duration-200">
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-lg font-medium text-gray-400 mb-3">Total Chat</h3>
                            <p className="text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none mb-3">
                                {projects.length}
                            </p>
                            <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-100 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200"
                            >
                                New Project
                            </button>
                            <button className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600">
                                Import Project
                            </button>
                        </div>
                    </div>
                </div>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...projects].reverse().map(project => (
                        <div 
                            key={project.id}
                            onClick={() => handleProjectClick(project.id)}
                            onContextMenu={(e) => handleContextMenu(e, project.id)}
                            className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-100 truncate">
                                    {project.name}
                                </h3>
                                {project.is_public ? (
                                    <Globe className="text-green-400" size={20} />
                                ) : (
                                    <Lock className="text-gray-400" size={20} />
                                )}
                            </div>
                            
                            <div className="flex items-center text-gray-400 mb-2">
                                <Users size={16} className="mr-2" />
                                <span className="text-sm">
                                    {project.collaborators.length === 0 
                                        ? 'No collaborators' 
                                        : `${project.collaborators.length} collaborator${project.collaborators.length !== 1 ? 's' : ''}`}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {/* {project.collaborators.map(collaborator => (
                                    <span 
                                        key={collaborator.id}
                                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full truncate max-w-[150px]"
                                        title={collaborator.email}
                                    >
                                        {collaborator.email}
                                    </span>
                                ))} */}
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-6">
                        <p className="text-gray-400">No projects yet. Create your first project!</p>
                    </div>
                )}

                {contextMenu.show && (
                    <ProjectContextMenu
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onEdit={handleEditProject}
                        onDelete={handleDeleteProject}
                        onClose={() => setContextMenu({ ...contextMenu, show: false })}
                    />
                )}
            </div>          
        </div>
    );
};

export default Home; 