// import { useRouter } from 'next/router';
// import React, { useEffect, useState } from 'react';
// import Chat from '../../components/Chat';
// import Sidebar from '../../components/Sidebar';
// import { openChat, newProject, fetchAllProjects } from '../../services/api';
// import { useProject } from '../../contexts/ProjectContext';
// import { useUser } from '@/src/contexts/UserContext';
// import Signup from '@/src/components/Signup';
// import Login from '@/src/components/Login';
// import Home from '@/src/components/Home';
// import ToolBar from '@/src/components/ToolBar';
// import LoadingPage from '@/src/components/LoadingPage';


// const ChatPage: React.FC = () => {
//     const router = useRouter();
//     const { project_id } = router.query;
//     const { project, setProject } = useProject();
//     const { user, setUser } = useUser();
//     const [isAuthenticated, setIsAuthenticated] = useState(true);
//     const [isSignup, setIsSignup] = useState(false);
//     const [isMenuMode, setIsMenuMode] = useState(true);
//     const [currentSection, setCurrentSection] = useState<'home' |'settings' | 'account'>('home');
//     const [isVisible, setIsVisible] = useState(false);
//     const [currentProject, setCurrentProject] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
    
//     useEffect(() => {
//         if (localStorage.getItem('user')) {
//             const user = JSON.parse(localStorage.getItem('user') || '{}');
//             setUser(user);
//             setIsAuthenticated(true);
//         }
//     }, []);

//     useEffect(() => {
//         if (project_id) {
//             const fetchProject = async () => {
//                 const response = await fetch(`http://localhost:8000/api/project/${project_id}`);
//                 const data = await response.json();
//                 setCurrentProject(data);
//             }
//             fetchProject();
//         }
//     }, [project_id]);

//     // this will run when the code successfully fetch the project
//     const successRetrieve = () => {
//         setIsVisible(true);
//         setIsLoading(false);
//     }

//     const handleLogin = async (user: object) => {
//         setIsAuthenticated(true);
//     };

//     const handleSignup = (userData: { email: string; id: string }) => {
//         setIsAuthenticated(true);
//     };

//     if (!isAuthenticated) {
//         return isSignup ? (
//             <Signup onSignup={handleSignup} onLoginClick={() => setIsSignup(false)} />
//         ) : (
//             <Login 
//                 onLogin={handleLogin} 
//                 onSignupClick={() => setIsSignup(true)}
//             />
//         );
//     }
    
//     return (
//         <>
//             {isLoading && (
//                 <LoadingPage />
//             )}
//         <div className="flex flex-column h-screen bg-gray-900">
//             <div className="">
//                 <Sidebar 
//                     isHome={false}
//                     isMenuMode={isMenuMode}
//                     setIsMenuMode={setIsMenuMode}
//                     currentSection={currentSection}
//                     setCurrentSection={setCurrentSection}
//                     setIsAuthenticated={setIsAuthenticated}
//                 />
//             </div>
//             <div className="">
//                 <Chat 
//                     project={currentProject}
//                     user={user}
//                     toolbarVisible={isVisible}
//                     setToolbarVisible={setIsVisible}
//                 />
//             </div>
//             <div className="">
//                 <ToolBar 
//                     isVisible={isVisible}
//                     setIsVisible={setIsVisible}
//                 />
//             </div>
//         </div>
//         </>
//     );
// };

// export default ChatPage;