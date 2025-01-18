import React, { useState } from 'react';
import { Bold, Italic, List, Link, Image, Code, Quote, ChevronRight, ChevronLeft } from 'lucide-react';

interface ToolBarProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
}

interface SliderOption {
    name: string;
    value: number;
    min: number;
    max: number;
}

interface DisplacementOption {
    name: string;
    x: number;
    y: number;
    z: number;
}

interface ColorOption {
    name: string;
    value: string;
}

interface OtherOption {
    name: string;
    value: number;
}

const ToolBar: React.FC<ToolBarProps> = ({ isVisible, setIsVisible }) => {
    const [colors, setColors] = useState<ColorOption[]>([
        {
            name: 'Chair Leg',
            value: '#FF0000'
        },
        {
            name: 'Chair Seat',
            value: '#0000FF'
        }
    ]);

    const [scaleFactor, setScaleFactor] = useState<number>(1);

    const [sliders, setSliders] = useState<SliderOption[]>([
        {
            name: 'Chair Leg',
            value: 100,
            min: 0,
            max: 200
        },
        {
            name: 'Chair Seat',
            value: 200,
            min: 0,
            max: 400
        }
    ]);

    const [displacements, setDisplacements] = useState<DisplacementOption[]>([
        {
            name: 'Chair Leg',
            x: 0,
            y: 0,
            z: 0
        }
    ]);

    const handleApplyChanges = () => {
        console.log('apply changes');
    };

    const handleSliderChange = (index: number, newValue: number) => {
        const updatedSliders = [...sliders];
        updatedSliders[index].value = newValue;
        setSliders(updatedSliders);
    };

    const handleColorChange = (index: number, newValue: string) => {
        const updatedColors = [...colors];
        updatedColors[index].value = newValue;
        setColors(updatedColors);
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

            {/* Tools Section */}
            <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden">
                {/* Colors Section */}
                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Colors
                    </h3>
                    {colors.map((color, index) => (
                        <div key={color.name} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-serif">{color.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-serif text-gray-500">{color.value}</span>
                                    <div className="relative">
                                        <div 
                                            className="w-6 h-6 rounded border border-gray-200"
                                            style={{ backgroundColor: color.value }}
                                        />
                                        <input
                                            type="color"
                                            value={color.value}
                                            onChange={(e) => handleColorChange(index, e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Slider Section */}
                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Sliders
                    </h3>
                    <div className="space-y-3">
                        {sliders.map((slider, index) => (
                            <div key={slider.name} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-serif">{slider.name}</span>
                                    <span className="text-sm font-serif text-gray-500">{slider.value}</span>
                                </div>
                                <input
                                    type="range"
                                    min={slider.min}
                                    max={slider.max}
                                    value={slider.value}
                                    onChange={(e) => handleSliderChange(index, Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Displacements Section */}
                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Displacements
                    </h3>
                </div>
                <div className="space-y-3">
                    {displacements.map((displacement, index) => (
                        <div key={displacement.name} className="space-y-1">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-serif">{displacement.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-serif text-gray-500">X</label>
                                    <input
                                        type="number"
                                        value={displacement.x}
                                        onChange={(e) => {
                                            const newDisplacements = [...displacements];
                                            newDisplacements[index].x = Number(e.target.value);
                                            setDisplacements(newDisplacements);
                                        }}
                                        className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-serif text-gray-500">Y</label>
                                    <input
                                        type="number"
                                        value={displacement.y}
                                        onChange={(e) => {
                                            const newDisplacements = [...displacements];
                                            newDisplacements[index].y = Number(e.target.value);
                                            setDisplacements(newDisplacements);
                                        }}
                                        className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-serif text-gray-500">Z</label>
                                    <input
                                        type="number"
                                        value={displacement.z}
                                        onChange={(e) => {
                                            const newDisplacements = [...displacements];
                                            newDisplacements[index].z = Number(e.target.value);
                                            setDisplacements(newDisplacements);
                                        }}
                                        className="w-full px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Other Section */}
                <div className="space-y-2">
                    <h3 className="font-serif text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Other
                    </h3>
                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-serif">Scale Factor</span>
                            <input
                                type="number"
                                className="w-24 px-2 py-1 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 font-mono focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                                value={scaleFactor}
                                onChange={(e) => {
                                    setScaleFactor(Number(e.target.value));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* submit toggles button */}
            <button 
                className="ml-[5%] w-[90%] mt-auto mb-4 bg-gray-900 text-white py-3 font-serif tracking-wide text-sm border-t border-gray-200"
                onClick={() => { handleApplyChanges() }}
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
