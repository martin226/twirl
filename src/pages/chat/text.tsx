import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';
import { openChat, newProject, fetchAllProjects } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';
import { useUser } from '@/src/contexts/UserContext';
import Signup from '@/src/components/Signup';
import Login from '@/src/components/Login';
import Home from '@/src/components/Home';
import ToolBar from '@/src/components/ToolBar';


const ChatPage: React.FC = () => {
    const router = useRouter();
    const { project_id } = router.query;
    const { project, setProject } = useProject();
    const { user, setUser } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isSignup, setIsSignup] = useState(false);
    const [isMenuMode, setIsMenuMode] = useState(false);
    const [currentSection, setCurrentSection] = useState<'home' |'settings' | 'account'>('home');

    // useEffect(() => {
    //     if (localStorage.getItem('user')) {
    //         const user = JSON.parse(localStorage.getItem('user') || '{}');
    //         setUser(user);
    //         setIsAuthenticated(true);
    //     }
    // }, []);

    useEffect(() => {
        if (user && project_id) {
            setProject(null);
            openChat(user.id, project_id as string)
                .then(projectData => {
                    if (projectData) {
                        setProject(projectData);
                    } else {
                        console.error('Project not found');
                        // router.push('/error');
                    }
                });
        }
    }, [user, project_id]);

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
    
    return (
        <div className="flex flex-column h-screen bg-gray-900">
            <div className="">
                <Sidebar 
                    isHome={false}
                    isMenuMode={isMenuMode}
                    setIsMenuMode={setIsMenuMode}
                    currentSection={currentSection}
                    setCurrentSection={setCurrentSection}
                />
            </div>
            <div className="">
                <Chat 
                    project={project}
                    user={user}
                />
            </div>
            <div className="">
                <ToolBar />
            </div>

        </div>
    );
};

export default ChatPage;