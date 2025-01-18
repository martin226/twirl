import React, { useEffect, useState } from 'react';

import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';
import Login from '../components/Login';
import Signup from './Signup';
import { useUser } from '../contexts/UserContext';
import NewProjectModal from './NewProjectModal';
import { useRouter } from 'next/router';


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

    //router
    const router = useRouter(); 

    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(user);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(true);
            setUser({email: 'jeff.lu234@gmail.com', id: '1234567890'});
        }
    }, []);

    const handleLogin = async (user: object) => {
        const mockUser = {
            email: 'jeff.lu234@gmail.com',
            id: Math.random().toString(36).substring(7)
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        router.push('/');
    };

    const handleSignup = (userData: { email: string; id: string }) => {
        const mockUser = {
            email: 'jeff.lu234@gmail.com',
            id: Math.random().toString(36).substring(7)
        };
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
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

    const handleCreateProject = async (projectName: string) => {
        try {
            // Mock return while commented out
            // return { project_id: 'temp-id' };

            const response = await fetch('http://localhost:8000/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: projectName }),
            });
            const data = await response.json();
            router.push(`/chat/${data.id}`);
            return data;
            
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
                setIsAuthenticated={setIsAuthenticated}
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