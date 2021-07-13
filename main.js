import {Document, NodeIO} from '@gltf-transform/core';
import path from "path";
import fs from 'fs';
import obj2gltf from 'obj2gltf'
import {prune} from "@gltf-transform/functions";

// probably change to cwd when converted to actual Node script
// For some reason this pathname is the only way to make it work
// Either Webstorm weirdness, or my own lack of understanding.
const __dirname = path.dirname('./models/models');
const outDir = path.join(__dirname, 'GLTFOut');

// Create output folder
fs.mkdir(outDir,
    {recursive: true},
    (err) => {
    if (err){
        console.log(err);
    }
});

// Read all files in dir
const files = fs.readdirSync(__dirname);
// Select required files
const targetFiles =  files.filter(file => {
    return path.extname(file).toLowerCase() === ".obj";
})

// Change from .obj to .gltf
// Function created for ease of use, whole script needs cleanup
function changeExtension(file, extension){
    const basename = path.basename(file, path.extname(file))
    return path.join(path.dirname(file), basename + extension);
}
//convert OBJ to GLTF
for (const file in targetFiles){
    const fn = path.join(__dirname, targetFiles[file]);
    const fn_out = path.join(outDir, changeExtension(targetFiles[file], ".glb"));

    obj2gltf(fn ,{binary : true})
        .then(function(glb){
            //const data = Buffer.from(JSON.stringify(glb));
            fs.writeFileSync(fn_out, glb);
        });
    //console.log("Files written to " + outDir)
}

// GLTF-Transform
const io = new NodeIO();
const document = new Document();

const glb_files = fs.readdirSync(outDir).filter((file => {
    return path.extname(file).toLowerCase() === ".glb";
}))

// Load N files and merge into one document with N Scenes
for (const file in glb_files){
    const fp = path.join(outDir, glb_files[file]);
    document.merge(io.read(fp))
}

const root = document.getRoot();
const rootBuffer = root.listBuffers()[0];

const mainScene = root.listScenes()[0];

// Iterate over scenes in document, move children into common scene
let i = 0; // frame index

root.listAccessors().forEach((a) => a.setBuffer(rootBuffer));
root.listBuffers().forEach((b, index) => index > 0 ? b.dispose() : null)

for (const scene of root.listScenes()) {

    if (scene === mainScene)
        scene.setName("Main")

    for (const child of scene.listChildren()){
        scene.setName(`Frame_${i}`)
        mainScene.addChild(child)
        i++
    }
    scene.dispose();
}

await document.transform(prune());
console.log(document)
io.write(path.join(outDir, "model.glb"), document)
