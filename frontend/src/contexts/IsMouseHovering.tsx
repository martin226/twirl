import { createContext, useContext, useState, ReactNode } from 'react';

interface IsMouseHoveringContextType {
    isMouseHovering: boolean;
    setIsMouseHovering: React.Dispatch<React.SetStateAction<boolean>>;
}

export const IsMouseHoveringContext = createContext<IsMouseHoveringContextType>({
    isMouseHovering: false,
    setIsMouseHovering: () => {}
});

export const IsMouseHoveringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMouseHovering, setIsMouseHovering] = useState<boolean>(false);

    return (
        <IsMouseHoveringContext.Provider value={{ isMouseHovering, setIsMouseHovering }}>
            {children}
        </IsMouseHoveringContext.Provider>
    );
};

export const useIsMouseHovering = () => useContext(IsMouseHoveringContext); 