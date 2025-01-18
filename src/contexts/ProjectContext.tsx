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
    const [project, setProject] = useState<any | null>(null);

    return (
        <ProjectContext.Provider value={{ project, setProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => useContext(ProjectContext); 