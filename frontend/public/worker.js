import * as OpenSCAD from './openscad.js';  // Use relative path if needed

console.log(OpenSCAD);

self.onmessage = async function (e) {
    const { scadCode, outputFile } = e.data;
    console.log('Received SCAD code:', scadCode);
    const instance = await OpenSCAD.default({ noInitialRun: true });
    instance.FS.writeFile("/input.scad", scadCode);
    instance.callMain([
        "/input.scad",
        "--enable=all",
        "--export-format=binstl",
        "-o",
        outputFile
    ]);
    const output = instance.FS.readFile("/" + outputFile);
    postMessage({ outputFile, output });
};