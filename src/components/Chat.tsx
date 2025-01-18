import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import ToolBar from './ToolBar';
import { Canvas } from '@react-three/fiber';
import { Stats } from '@react-three/drei';
import ModelViewer from './ModelViewer';
import { usePdrStore } from '../contexts/store';

interface ChatProps {
    project: any;
    user: any;
}

const Chat: React.FC<ChatProps> = ({ project, user }) => {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messageAreaRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Auto-resize textarea as content grows
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    // Measure message area dimensions
    useEffect(() => {
        const updateDimensions = () => {
            if (messageAreaRef.current) {
                const { offsetWidth, offsetHeight } = messageAreaRef.current;
                setDimensions({
                    width: offsetWidth,
                    height: offsetHeight
                });
                console.log('Message Area Dimensions:', { width: offsetWidth, height: offsetHeight });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // Handle send message
        }
    };

    const { worker, setWorker } = usePdrStore();

    return (
        <div className="absolute left-[15vw] right-[15vw] h-screen bg-[#F6F5F0] flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
                <h2 className="text-xl font-serif font-bold text-gray-900">
                    {project?.name || 'Loading...'}
                </h2>
                <button onClick={() => {
                    console.log("Setting worker");
                    setWorker(new Worker('/worker.js', { type: 'module' }));
                }}>Balls</button>
                <button onClick={() => {

                    if (worker) {
                        console.log("Sending message");
                        const scadCode = `
// Laptop dimensions
width = 300;
depth = 200;
base_height = 15;
screen_thickness = 8;
screen_angle = 110; // Angle of screen (> 90 means tilted back)

// Base of laptop
color("black")
cube([width, depth, base_height]);

// Keyboard
translate([20, 20, base_height]) {
    color("darkgray")
    cube([width-40, depth-40, 1]);
    
    // Generate keyboard keys
    for(x = [0:14]) {
        for(y = [0:5]) {
            translate([10 + x*18, 10 + y*25, 1])
            color("black")
            cube([15, 20, 1]);
        }
    }
    
    // Trackpad
    translate([width/2 - 40, depth-90, 1])
    color("lightgray")
    cube([80, 50, 0.5]);
}

// Screen assembly
translate([0, depth, base_height])
rotate([180-screen_angle, 0, 0]) {
    // Screen bezel
    color("black")
    difference() {
        cube([width, depth, screen_thickness]);
        
        // Screen area cutout
        translate([15, 15, screen_thickness-1])
        cube([width-30, depth-30, 2]);
    }
    
    // Screen display
    translate([15, 15, screen_thickness-0.5])
    color("purple")
    cube([width-30, depth-30, 0.5]);
    
    // Webcam
    translate([width/2-2, depth-10, screen_thickness])
    color("darkgray")
    cylinder(h=0.5, r=2, $fn=20);
}

// Hinge cover
translate([0, depth-5, base_height-2])
color("black")
cube([width, 10, 4]);

// Brand logo (simple circle)
translate([width/2, depth/2, 0])
rotate([0, 0, 0])
color("silver")
cylinder(h=base_height+0.1, r=10, $fn=30);
                        `;
                        const outputFile = 'cube.stl';
                        worker.postMessage({ scadCode, outputFile });
                    }
                }}>Try itch</button>
            </div>

            {/* Messages Area */}
            <div
                ref={messageAreaRef}
                className="relative flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar border-8 border-red-500"
            >
                <Stats parent={messageAreaRef} className="!absolute" />
                <Canvas>
                    <ModelViewer />
                </Canvas>
                {/* width: {dimensions.width} <br />
               height: {dimensions.height} */}
            </div>

            {/* Floating Input Area */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-4xl">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-4">
                    <div className="flex items-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-white rounded-xl border border-gray-200">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Write your message..."
                                className="w-full bg-transparent text-gray-900 p-3 font-serif resize-none overflow-hidden focus:outline-none min-h-[44px] max-h-[200px]"
                                style={{ lineHeight: '1.5' }}
                                rows={1}
                            />
                        </div>
                        <button
                            className={`p-3 bg-gray-900 rounded-lg text-white transition-colors ${!message.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                                }`}
                            disabled={!message.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;