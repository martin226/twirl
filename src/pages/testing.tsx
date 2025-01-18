// App.tsx (or any React component)

import React, { useEffect, useState } from 'react';

function createWorker() {
    return new Worker("worker.js", { type: 'module' });
}

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/Addons.js';
import { MeshStandardMaterial } from 'three';

function STLModel({ url }: any) {
  const geometry = useLoader(STLLoader, url);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

const App: React.FC = () => {
    const [worker, setWorker] = useState<Worker | null>(null);
    const [url, setUrl] = useState<string | null>(null);

    // Set up the worker and communication
    useEffect(() => {
        if (worker) {
            return;
        }
        const newWorker = createWorker();

        newWorker.onmessage = function (e) {
            const { outputFile, output } = e.data;

            // pass outputFile into three.js

            console.log("Received output", output);
            setUrl(URL.createObjectURL(new Blob([output], { type: "application/octet-stream" })));


            // Create a link to download the generated STL file
            // const link = document.createElement("a");
            // link.href = URL.createObjectURL(new Blob([output], { type: "application/octet-stream" }));

            // link.download = outputFile;
            // document.body.append(link);
            // link.click();
            // link.remove();
        };

        console.log("Setting worker", newWorker);

        setWorker(newWorker);

        // Clean up the worker when the component is unmounted
        // return () => {
        //     newWorker.terminate();
        // };
    }, []);

    const handleRunOpenSCAD = () => {
        if (!worker) {
            console.error('Worker not initialized');
            return;
        }
        const scadCode = 'cube(10);'; // SCAD code for a cube
        const outputFile = 'cube.stl';

        // Send the SCAD code and output filename to the worker
        console.log("Creating worker");
        // const worker = createWorker();

        // setWorker(worker);

        worker.postMessage({ scadCode, outputFile });
    };

    const sendMessage = () => {
        if (!worker) {
            console.error('Worker not initialized');
            return;
        }
        worker.postMessage('Hello from the main thread!');
    }

    return (
        <div>
            <button onClick={handleRunOpenSCAD}>Generate Cube</button>
            <button onClick={sendMessage}>Send Message</button>
            {url && (
                <>
                    {url}
                    <Canvas>
                        <OrbitControls />
                        <STLModel url={url} />
                    </Canvas>
                </>
            )}
        </div>
    );
};

export default App;