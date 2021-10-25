import {Document, NodeIO} from '@gltf-transform/core';
import path from "path";
import fs from 'fs';
import obj2gltf from 'obj2gltf'
import {dedup, prune} from "@gltf-transform/functions";

// use string over path functions for exact folder
const f_out = './GLTFOut'
const obj_seq = './OBJSequence/'
const glb_seq = path.join(f_out, "GLB Sequence")


// Create output folder
fs.mkdir(f_out,
    {recursive: true},
    (err) => {
    if (err){
        console.log(err);
    }
});

// Read all files in dir
const files = fs.readdirSync(obj_seq);
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
    // Rename file to:
    //* output_directory + file
    const fn = path.join(obj_seq, targetFiles[file]);

    // describe output path as:
    //* output_directory + file.EXT
    const fn_out = path.join(glb_seq + "", changeExtension(targetFiles[file], ".glb"));


    obj2gltf(fn ,{binary : true})
        .then(function(glb){
            fs.writeFileSync(fn_out, glb);
        });
    //console.log("Files written to " + f_out)
}

// GLTF-Transform
const io = new NodeIO();
const document = new Document();

const glb_files = fs.readdirSync(glb_seq).filter((file => {
    return path.extname(file).toLowerCase() === ".glb";
}))

// Load N files and merge into one document with N Scenes
for (const file in glb_files){
    const fp = path.join(glb_seq, glb_files[file]);
    document.merge(io.read(fp))
}

const root = document.getRoot();
const rootBuffer = root.listBuffers()[0];
root.setName("Root")
const mainScene = root.listScenes()[0];

// Iterate over scenes in document, move children into common scene
let i = 0; // frame index

root.listAccessors().forEach((a) => a.setBuffer(rootBuffer));
root.listBuffers().forEach((b, index) => index > 0 ? b.dispose() : null)

for (const scene of root.listScenes()) {

    if (scene === mainScene)
        continue;

    for (const child of scene.listChildren()){
        child.setName(`Frame_${i}`);
        mainScene.addChild(child)
        i++
    }
    scene.dispose();
}

await document.transform(prune());
// add dedup pass
io.write(path.join(f_out, "model.glb"), document)
