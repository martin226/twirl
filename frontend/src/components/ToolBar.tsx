import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown, Settings, Code } from 'lucide-react';
import { useIsMouseHovering } from '../contexts/IsMouseHovering';
import { Parameter } from '../contexts/store';
import { useStateStore } from '../contexts/store';
import { usePdrStore } from '../contexts/store';
import { useProject } from '../contexts/ProjectContext';

interface ToolBarProps {
    project_id: string;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    setIsLoading: (isLoading: boolean) => void;
}

const ParameterGroup: React.FC<{ 
    parameter: Parameter, 
    level: number,
    path: number[],
    onUpdate: (path: number[], newValue: number) => void 
}> = ({ parameter, level, path, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(true);
    const paddingLeft = `${level * 0.75}rem`;
    const { isMouseHovering } = useIsMouseHovering();
    const [isCodeMode, setIsCodeMode] = useState(false);

    if (parameter.group) {
        return (
            <div className="space-y-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between p-2 rounded transition-colors duration-500
                        ${isMouseHovering ? 
                            'bg-[#d4e1ff] hover:bg-[#c9d3ff] text-[#2d3d6d]' : 
                            'hover:bg-gray-50 text-gray-900'}`}
                    style={{ paddingLeft }}
                >
                    <span className="text-sm font-sans font-bold">{parameter.name}</span>
                    <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${isOpen ? '' : '-rotate-90'} 
                            ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}
                    />
                </button>
                {isOpen && parameter.parameters && (
                    <div className="space-y-2 py-1">
                        {parameter.parameters.map((param, index) => (
                            <ParameterGroup 
                                key={`${param.name}-${index}`} 
                                parameter={param} 
                                level={level + 1}
                                path={[...path, index]}
                                onUpdate={onUpdate}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Handle different parameter types
    switch (parameter.type) {
        case 'slider':
            return (
                <div className="space-y-1.5 px-3" style={{ paddingLeft: `calc(${paddingLeft} + 0.75rem)` }}>
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-['Cinzel'] transition-colors duration-500
                            ${isMouseHovering ? 'text-[#2d3d6d] font-medium' : 'text-gray-700'}`}>
                            {parameter.name}
                        </span>
                        <span className={`text-sm font-mono transition-colors duration-500
                            ${isMouseHovering ? 'text-[#574191] font-bold' : 'text-gray-500'}`}>
                            {parameter.value}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={parameter.min_value}
                        max={parameter.max_value}
                        value={parameter.value}
                        onChange={(e) => onUpdate(path, Number(e.target.value))}
                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer
                            ${isMouseHovering ? 
                                'bg-[#d4e1ff] accent-[#415791]' : 
                                'bg-gray-200 accent-gray-900'}`}
                    />
                </div>
            );
        case 'none':
            return (
                <div className="px-3" style={{ paddingLeft: `calc(${paddingLeft} + 0.75rem)` }}>
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-['Cinzel'] transition-colors duration-500
                            ${isMouseHovering ? 'text-[#2d3d6d] font-medium' : 'text-gray-700'}`}>
                            {parameter.name}
                        </span>
                        <input
                            type="number"
                            value={parameter.value}
                            onChange={(e) => onUpdate(path, Number(e.target.value))}
                            className={`w-20 px-2 py-1 text-sm rounded-lg font-mono focus:outline-none focus:ring-2
                                transition-colors duration-500
                                ${isMouseHovering ? 
                                    'bg-[#d4e1ff] border-[#a5b8e3] text-[#2d3d6d] focus:ring-[#415791]' : 
                                    'bg-white border-gray-200 text-gray-900 focus:ring-gray-400'}`}
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
};

const ToolBar: React.FC<ToolBarProps> = ({ project_id, isVisible, setIsVisible, setIsLoading }) => {
  const { openscad, setOpenscad, parameters, setParameters } = useStateStore();
  const { worker, setWorker } = usePdrStore();
  const { isMouseHovering } = useIsMouseHovering();
  const [isCodeMode, setIsCodeMode] = useState(false);
  const { project, setProject } = useProject();
    // const [openscad, setOpenscad] = useState<string>("");
    // const [parameters, setParameters] = useState<Parameter[]>([]);

    useEffect(() => {
        if (project_id) handleUpdateParameter(project_id);
    }, [project_id]);

    function handleUpdateParameter(project_id: string) {
        fetch(`http://localhost:8000/api/project/${project_id}/scad_parameters`)
            .then(response => response.json())
            .then(data => {
                console.log("GOT SCAD PARAMETERS", data);
                if (!data.openscad_code) {
                    if (worker) {
                        worker.postMessage({ scadCode: data.openscad_code, outputFile: 'output.stl' });
                    } else {
                        const newWorker = new Worker('/worker.js', { type: 'module' });
                        setWorker(newWorker);
                        newWorker.postMessage({ scadCode: data.openscad_code, outputFile: 'output.stl' });
                    }
                    setOpenscad('');
                }
                if (!data.parameters) {
                    setParameters([]);
                }
                if (!data.openscad_code || !data.parameters) {
                    return;
                }
                console.log("Posting message");
                if (worker) {
                    worker.postMessage({ scadCode: data.openscad_code, outputFile: 'output.stl' });
                } else {
                    const newWorker = new Worker('/worker.js', { type: 'module' });
                    setWorker(newWorker);
                    newWorker.postMessage({ scadCode: data.openscad_code, outputFile: 'output.stl' });
                }
                setOpenscad(data.openscad_code);
                console.log("Openscad code", data.openscad_code);
                console.log("Setting parameters");
                setParameters(JSON.parse(data.parameters));
            })
    }

    const handleApplyChanges = () => {
        // Create a flat map of all parameters for easy lookup
        setIsLoading(true);
        const parameterMap = new Map<string, number>();
        
        const flattenParameters = (params: Parameter[], prefix = '') => {
            params.forEach(param => {
                if (!param.group && param.name && param.value !== undefined) {
                    parameterMap.set(param.name, param.value);
                }
                if (param.parameters) {
                    flattenParameters(param.parameters, `${prefix}${param.name}_`);
                }
            });
        };
        
        flattenParameters(parameters);
        //test
        // Update OpenSCAD code with new parameter values
        let updatedCode = openscad;
        console.log("Current openscad code", openscad);
        parameterMap.forEach((value, name) => {
            // Match variable declarations like: name = 123;
            const regex = new RegExp(`(${name}\\s*=\\s*)[\\d.-]+;`, 'g');
            // console.log("Regex", regex);
            updatedCode = updatedCode.replace(regex, `$1${value};`);
            console.log("Updated code", updatedCode);
        });

        // worker?.postMessage({ scadCode: updatedCode, outputFile: 'output.stl' });
        if (worker) {
            worker.postMessage({ scadCode: updatedCode, outputFile: 'output.stl' });
        } else {
            const newWorker = new Worker('/worker.js', { type: 'module' });
            setWorker(newWorker);
            newWorker.postMessage({ scadCode: updatedCode, outputFile: 'output.stl' });
        }

        // send the updated parameters and openscad code to the backend
        fetch(`http://localhost:8000/api/project/${project_id}/scad_parameters`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                openscad_code: updatedCode,
                parameters: JSON.stringify(parameters),
            }),
        });

        setTimeout(() => {
            setIsLoading(false);
        }, 1000); //jeff chnage this
        
        setOpenscad(updatedCode);
        console.log('Applied changes:', parameters);
        return parameters;
    };

    const updateParameter = (paramPath: number[], newValue: number) => {
        setParameters(prevParams => {
            const newParams = JSON.parse(JSON.stringify(prevParams));
            let current = newParams;
            
            // Navigate to tsehe parent of the target parameter
            for (let i = 0; i < paramPath.length - 1; i++) {
                if (current[paramPath[i]]?.parameters) {
                    current = current[paramPath[i]].parameters;
                }
            }
            
            // Update the value of the target parameter
            const lastIndex = paramPath[paramPath.length - 1];
            if (current[lastIndex]) {
                current[lastIndex].value = newValue;
            }
            
            // console.log("Returning new params", newParams)
            return newParams;
        });
    };

    useEffect(() => {
      console.log('Openscad code:', openscad);
    }, [openscad]);
    
    return isVisible ? (
        <div className={`absolute right-0 top-0 w-[300px] max-w-[90vw] h-full border-l shadow-lg z-50 flex flex-col
            transition-all duration-500
            ${isMouseHovering ? 
                'bg-gradient-to-b from-[#e4edff] via-[#d5e4ff] to-[#e4edff] border-[#a5b8e3]/30 text-[#415791]' : 
                'bg-[#F6F5F0] border-gray-200'
            }`}>
            {/* Header */}
            <div className={`sticky top-0 p-4 border-b-2 z-10 transition-colors duration-500
                ${isMouseHovering ? 
                    'border-[#2d3d6d] bg-[#e4edff]' : 
                    'border-gray-900 bg-[#F6F5F0]'
                }`}>
                <div className="flex items-center justify-between mb-2">
                    {/* Code/Parameter toggle button */}
                    <button 
                        onClick={() => setIsCodeMode(!isCodeMode)}
                        className={`px-3 py-2 rounded-lg transition-all duration-500 flex items-center gap-2 font-sans text-sm
                            ${isMouseHovering ? 
                                'bg-[#415791] text-[#e4edff] hover:bg-[#2d3d6d] shadow-md' : 
                                'bg-gray-900 text-white hover:bg-gray-800'}`}
                        title={isCodeMode ? "Switch to parameters" : "Switch to code"}
                    >
                        {isCodeMode ? (
                            <>
                                <Settings size={16} />
                                <span>Parameters</span>
                            </>
                        ) : (
                            <>
                                <Code size={16} />
                                <span>Code</span>
                            </>
                        )}
                    </button>

                    {/* Minimize button */}
                    <button 
                        onClick={() => setIsVisible(false)}
                        className={`px-3 py-2 rounded-lg transition-all duration-500 flex items-center gap-2 font-sans text-sm ml-2
                            ${isMouseHovering ? 
                                'bg-[#415791] text-[#e4edff] hover:bg-[#2d3d6d] shadow-md' : 
                                'bg-gray-900 text-white hover:bg-gray-800'}`}
                        title="Minimize toolbar"
                    >
                        <ChevronRight size={16} />
                        <span>Hide</span>
                    </button>
                </div>
                <h2 className={`text-xl font-sans font-bold transition-colors duration-500
                    ${isMouseHovering ? 'text-[#3d2d6d]' : 'text-gray-900'}`}>
                    {isCodeMode ? 'Code Editor' : 'Parameter Editor'}
                </h2>
            {/* Parameters Section */}
            {/* <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {parameters && parameters.map((parameter, index) => (
                    <div key={`${parameter.name}-${index}`} className="bg-white rounded-lg shadow-sm p-2">
                        <ParameterGroup 
                            parameter={parameter} 
                            level={0}
                            path={[index]}
                            onUpdate={updateParameter}
                        />
                        </div>
                    ))}*/}
            </div> 

            {/* Parameters Section */}
            {isCodeMode ? (
                <div className="flex-1 px-3 py-2">
                    <textarea
                        className={`w-full h-full p-4 font-mono text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors duration-500
                            ${isMouseHovering ? 
                                'bg-[#1a3a5e]/10 text-[#2d3d6d] focus:ring-[#415791]' : 
                                'bg-gray-50 text-gray-900 focus:ring-gray-400'}`}
                        value={openscad}
                        readOnly
                    />
                </div>
            ) : (
                <div className="flex-1 px-3 py-2 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    {parameters.map((parameter, index) => (
                        <div key={`${parameter.name}-${index}`} className={`transition-colors duration-500
                            ${isMouseHovering ? 
                                'bg-[#e9f0ff] hover:bg-[#e4edff] border border-[#a5b8e3]/50' : 
                                'bg-white hover:bg-gray-50'} 
                            rounded-lg shadow-sm p-3 pl-4`}>
                            <ParameterGroup 
                                parameter={parameter} 
                                level={0}
                                path={[index]}
                                onUpdate={updateParameter}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Apply Changes Button */}
            <div className={`sticky bottom-0 p-4 border-t transition-colors duration-500
                ${isMouseHovering ? 
                    'bg-[#e4edff] border-[#a5b8e3]/30' : 
                    'bg-[#F6F5F0] border-gray-200'} z-10`}>
                <button 
                    className={`w-full py-2.5 rounded-lg font-sans tracking-wide text-sm transition-colors duration-500
                        ${isMouseHovering ? 
                            'bg-[#415791] hover:bg-[#2d3d6d] text-[#e4edff]' : 
                            'bg-gray-900 hover:bg-gray-800 text-white'}`}
                    onClick={handleApplyChanges}
                >
                    APPLY CHANGES
                </button>
                <div className={`mt-2 text-xs font-sans italic text-center transition-colors duration-500
                    ${isMouseHovering ? 'text-[#415791]' : 'text-gray-500'}`}>
                    Use the toolbar to customize your imagination
                </div>
            </div>
        </div>
    ) : (
        <button 
            onClick={() => setIsVisible(true)}
            className={`fixed right-0 top-4 p-2 rounded-l-lg shadow-lg transition-all duration-500 flex items-center gap-2 z-50
                ${isMouseHovering ? 
                    'bg-[#e4edff] border border-[#a5b8e3]/30 text-[#415791] hover:text-[#2d3d6d] hover:bg-[#d5e4ff]' : 
                    'bg-[#F6F5F0] border-l border-t border-b border-gray-200 text-gray-500 hover:text-gray-700'}`}
            title="Show toolbar"
        >
            <ChevronLeft size={18} />
            <span className="font-sans pr-1 text-sm">Toolbar</span>
        </button>
    );
};

export default ToolBar;
