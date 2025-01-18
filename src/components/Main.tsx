import React, { useEffect, useState } from 'react';

import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Login from '../components/Login';
import Signup from './Signup';
import { useUser } from '../contexts/UserContext';
import NewProjectModal from './NewProjectModal';


const Main: React.FC = () => {
    //user varaibles
    const { user, setUser } = useUser();

    //authentication varaibles
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isSignup, setIsSignup] = useState(false);

    //sidebar varaibles
    const [isMenuMode, setIsMenuMode] = useState(true);
    const [currentSection, setCurrentSection] = useState<'home' | 'settings' | 'account'>('home');
    
    //home varaibles
    const [currentView, setCurrentView] = useState<'home' | 'Whiteboard'>('home');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(user);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (user: object) => {
       
        setIsAuthenticated(true);
    };

    const handleSignup = (userData: { email: string; id: string }) => {
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return isSignup ? (
            <Signup onSignup={handleSignup} onLoginClick={() => setIsSignup(false)} />
        ) : (
            <Login 
                onLogin={handleLogin} 
                onSignupClick={() => setIsSignup(true)}
            />
        );
    }

    const handleCreateProject = async (projectName: string, collaborators: any[], isPublic: boolean) => {
        try {
            // Mock return while commented out
            return { project_id: 'temp-id' };
            
            // When uncommenting the API calls, remove the mock return above
            // const response = await newProject(user?.id || '', projectName, collaborators, isPublic);
            // if (user) {
            //     const updatedProjects = await fetchAllProjects(user.id);
            //     setHomeProjects(updatedProjects);
            // }
            // setIsModalOpen(false);
            // return response;
        } catch (error) {
            console.error('Failed to create project:', error);
            throw error; // Propagate error to modal
        }
    };
    
    return (
        <div className="w-full h-screen bg-[#F6F5F0]">
            <Sidebar 
                isHome={true}
                isMenuMode={isMenuMode}
                setIsMenuMode={setIsMenuMode}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
            />

            <Home 
                setIsModalOpen={setIsModalOpen}
            />

            <NewProjectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateProject={handleCreateProject}
            />
        </div>
    );
};

export default Main;