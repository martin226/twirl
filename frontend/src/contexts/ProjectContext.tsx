import { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectContextType {
    project: any | null;
    setProject: React.Dispatch<React.SetStateAction<any | null>>;
}

export const ProjectContext = createContext<ProjectContextType>({
    project: null,
    setProject: () => {}
});

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [project, setProject] = useState<any | null>([
        // { id: '1', name: 'Project Discussion', lastMessage: 'Let\'s review the updates' },
        // { id: '2', name: 'Team Sync', lastMessage: 'Meeting at 3 PM' },
        // { id: '3', name: 'Bug Reports', lastMessage: 'Fixed the login issue' },
        // { id: '4', name: 'Feature Planning', lastMessage: 'New dashboard layout' },
        // { id: '5', name: 'Daily Standup', lastMessage: 'Updates from yesterday' },
        // { id: '6', name: 'UI/UX Workshop', lastMessage: 'New design system proposal' },
        // { id: '7', name: 'Backend Team', lastMessage: 'Database optimization complete' },
        // { id: '8', name: 'Client Meeting', lastMessage: 'Presentation feedback' },
        // { id: '9', name: 'Product Roadmap', lastMessage: 'Q4 planning discussion' },
        // { id: '10', name: 'Security Updates', lastMessage: 'New authentication flow' },
        // { id: '11', name: 'Mobile App Dev', lastMessage: 'iOS build ready for testing' },
        // { id: '12', name: 'Analytics Review', lastMessage: 'Monthly metrics report' },
        // { id: '13', name: 'Marketing Sync', lastMessage: 'Campaign performance update' },
        // { id: '14', name: 'DevOps Planning', lastMessage: 'Deployment pipeline changes' },
    ]);

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext); 