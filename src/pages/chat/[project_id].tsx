import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Chat from '../../components/Chat';
import Sidebar from '../../components/Sidebar';
import { openWhiteboard, newProject, fetchAllProjects } from '../../services/api';
import { useProject } from '../../contexts/ProjectContext';
import { useUser } from '@/src/contexts/UserContext';
import Signup from '@/src/components/Signup';
import Login from '@/src/components/Login';
import Home from '@/src/components/Home';


const ChatPage: React.FC = () => {

    const dummyChats = [
        { id: '1', name: 'Project Discussion', lastMessage: 'Let\'s review the updates' },
        { id: '2', name: 'Team Sync', lastMessage: 'Meeting at 3 PM' },
        { id: '3', name: 'Bug Reports', lastMessage: 'Fixed the login issue' },
        { id: '4', name: 'Feature Planning', lastMessage: 'New dashboard layout' },
        { id: '5', name: 'Daily Standup', lastMessage: 'Updates from yesterday' },
        { id: '6', name: 'UI/UX Workshop', lastMessage: 'New design system proposal' },
        { id: '7', name: 'Backend Team', lastMessage: 'Database optimization complete' },
        { id: '8', name: 'Client Meeting', lastMessage: 'Presentation feedback' },
        { id: '9', name: 'Product Roadmap', lastMessage: 'Q4 planning discussion' },
        { id: '10', name: 'Security Updates', lastMessage: 'New authentication flow' },
        { id: '11', name: 'Mobile App Dev', lastMessage: 'iOS build ready for testing' },
        { id: '12', name: 'Analytics Review', lastMessage: 'Monthly metrics report' },
        { id: '13', name: 'Marketing Sync', lastMessage: 'Campaign performance update' },
        { id: '14', name: 'DevOps Planning', lastMessage: 'Deployment pipeline changes' },
        { id: '15', name: 'API Documentation', lastMessage: 'Updated endpoint specs' }
    ];

    const router = useRouter();
    const { project_id } = router.query;
    const { project, setProject } = useProject();
    const { user, setUser } = useUser();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isMenuMode, setIsMenuMode] = useState(false);
    const [currentSection, setCurrentSection] = useState<'home' | 'settings' | 'account'>('home');

    useEffect(() => {
        if (localStorage.getItem('user')) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setUser(user);
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        if (user && project_id) {
            setProject(null);
            openWhiteboard(user.id, project_id as string)
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
        <div className="w-full h-screen bg-gray-900 Whiteboard flex">
            <Sidebar 
                isHome={false}
                isMenuMode={isMenuMode}
                setIsMenuMode={setIsMenuMode}
                currentSection={currentSection}
                setCurrentSection={setCurrentSection}
                projects={dummyChats}
            />
            <Chat 
                project={project}
                user={user}
            />
        </div>
    );
};

export default ChatPage;