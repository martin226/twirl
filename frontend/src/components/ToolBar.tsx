import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';

interface ToolBarProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

interface Parameter {
    group: boolean;
    name: string;
    type?: string;
    value?: number;
    min_value?: number;
    max_value?: number;
    parameters?: Parameter[];
}

const ParameterGroup: React.FC<{ 
    parameter: Parameter, 
    level: number,
    path: number[],
    onUpdate: (path: number[], newValue: number) => void 
}> = ({ parameter, level, path, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(true);
    const paddingLeft = `${level * 1}rem`;

    if (parameter.group) {
        return (
            <div className="space-y-2">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-2 hover:bg-gray-100 rounded text-left"
                    style={{ paddingLeft }}
                >
                    <span className="text-sm font-serif">{parameter.name}</span>
                    <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${isOpen ? '' : '-rotate-90'}`}
                    />
                </button>
                {isOpen && parameter.parameters && (
                    <div className="space-y-2">
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
                <div className="space-y-1" style={{ paddingLeft }}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-serif">{parameter.name}</span>
                        <span className="text-sm font-serif text-gray-500">{parameter.value}</span>
                    </div>
                    <input
                        type="range"
                        min={parameter.min_value}
                        max={parameter.max_value}
                        value={parameter.value}
                        onChange={(e) => onUpdate(path, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                    />
                </div>
            );
        case 'none':
            return (
                <div className="space-y-1" style={{ paddingLeft }}>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-serif">{parameter.name}</span>
                        <input
                            type="number"
                            value={parameter.value}
                            onChange={(e) => onUpdate(path, Number(e.target.value))}
                            className="w-24 px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                        />
                    </div>
                </div>
            );
        default:
            return null;
    }
};

const ToolBar: React.FC<ToolBarProps> = ({ isVisible, setIsVisible }) => {
    const [receivedChanges] = useState<Parameter[]>([
        {
            "group": true,
            "name": "Table Top",
            "parameters": [
                {
                    "group": false,
                    "name": "table_top_length",
                    "type": "slider",
                    "min_value": 800,
                    "max_value": 2000,
                    "value": 1200
                },
                {
                    "group": false,
                    "name": "table_top_width",
                    "type": "slider",
                    "min_value": 600,
                    "max_value": 1200,
                    "value": 800
                },
                {
                    "group": false,
                    "name": "table_top_thickness",
                    "type": "slider",
                    "min_value": 20,
                    "max_value": 50,
                    "value": 30
                }
            ]
        },
        {
          "group": true,
          "name": "Table Legs",
          "parameters": [
            {
              "group": false,
              "name": "leg_radius",
              "type": "slider",
              "min_value": 20,
              "max_value": 50,
              "value": 30
            },
            {
              "group": false,
              "name": "leg_height",
              "type": "slider",
              "min_value": 400,
              "max_value": 800,
              "value": 700
            },
            {
              "group": true,
              "name": "Leg 1",
              "parameters": [
                {
                  "group": true,
                  "name": "Translation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg1_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg1_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg1_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                },
                {
                  "group": true,
                  "name": "Rotation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg1_rot_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg1_rot_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg1_rot_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                }
              ]
            },
            {
              "group": true,
              "name": "Leg 2",
              "parameters": [
                {
                  "group": true,
                  "name": "Translation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg2_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg2_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg2_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                },
                {
                  "group": true,
                  "name": "Rotation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg2_rot_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg2_rot_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg2_rot_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                }
              ]
            },
            {
              "group": true,
              "name": "Leg 3",
              "parameters": [
                {
                  "group": true,
                  "name": "Translation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg3_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg3_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg3_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                },
                {
                  "group": true,
                  "name": "Rotation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg3_rot_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg3_rot_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg3_rot_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                }
              ]
            },
            {
              "group": true,
              "name": "Leg 4",
              "parameters": [
                {
                  "group": true,
                  "name": "Translation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg4_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg4_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg4_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                },
                {
                  "group": true,
                  "name": "Rotation",
                  "parameters": [
                    {
                      "group": false,
                      "name": "leg4_rot_x",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg4_rot_y",
                      "type": "none",
                      "value": 0
                    },
                    {
                      "group": false,
                      "name": "leg4_rot_z",
                      "type": "none",
                      "value": 0
                    }
                  ]
                }
              ]
            }
          ]
        }
    ]);
    const [parameters, setParameters] = useState<Parameter[]>([]);

    useEffect(() => {
        setParameters(receivedChanges);
    }, []);

    const handleApplyChanges = () => {
        console.log('Applied changes:', parameters);
        return parameters;
    };

    const updateParameter = (paramPath: number[], newValue: number) => {
        setParameters(prevParams => {
            const newParams = JSON.parse(JSON.stringify(prevParams));
            let current = newParams;
            
            // Navigate to the parent of the target parameter
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
            
            return newParams;
        });
    };

    return isVisible ? (
        <div className="absolute right-0 top-0 w-[15vw] h-full bg-[#F6F5F0] border-l border-gray-200 shadow-lg z-50 flex flex-col">
            {/* Header */}
            <div className="p-5 border-b-2 border-gray-900 flex items-center justify-between">
                <div>
                    <div className="text-xs font-serif tracking-[0.2em] text-gray-500 mb-1">TOOLS</div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900">
                        TOOLBAR
                    </h2>
                </div>
                <button 
                    onClick={() => setIsVisible(false)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                    title="Minimize toolbar"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {/* Parameters Section */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto overflow-x-hidden">
                {parameters.map((parameter, index) => (
                    <ParameterGroup 
                        key={`${parameter.name}-${index}`} 
                        parameter={parameter} 
                        level={0}
                        path={[index]}
                        onUpdate={updateParameter}
                    />
                ))}
            </div>

            {/* Apply Changes Button */}
            <button 
                className="ml-[5%] w-[90%] mt-auto mb-4 bg-gray-900 text-white py-3 font-serif tracking-wide text-sm border-t border-gray-200"
                onClick={handleApplyChanges}
            >
                APPLY CHANGES
            </button>

            {/* Info Section */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="text-xs text-gray-500 font-serif italic">
                    Use the toolbar to customize your imagination
                </div>
            </div>
        </div>
    ) : (
        <button 
            onClick={() => setIsVisible(true)}
            className="absolute right-0 top-4 p-2 bg-[#F6F5F0] border-l border-t border-b border-gray-200 rounded-l-lg shadow-lg text-gray-500 hover:text-gray-700 transition-colors z-50 flex items-center gap-2"
            title="Show toolbar"
        >
            <ChevronLeft size={20} />
            <span className="font-serif pr-1">Toolbar</span>
        </button>
    );
};

export default ToolBar;
