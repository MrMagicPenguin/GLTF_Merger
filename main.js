import {Document, NodeIO} from '@gltf-transform/core';
import path from "path";
import fs from 'fs';
import obj2gltf from 'obj2gltf'

// probably change to cwd when converted to actual Node script
// For some reason this pathname is the only way to make it work
// Either Webstorm weirdness, or my own lack of understanding.
const __dirname = path.dirname('./models/models');
const outDir = path.join(__dirname, 'GLTF Out');

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
// for (const file in targetFiles){
//     const fn = path.join(__dirname, targetFiles[file]);
//     const fn_out = path.join(outDir, changeExtension(targetFiles[file], ".gltf"));
//     const ext = ".gltf";
//
//     obj2gltf(fn)
//         .then(function (gltf){
//             const data = Buffer.from(JSON.stringify(gltf));
//             fs.writeFileSync(fn_out, data);
//         });
//     //console.log("Files written to " + outDir)
//}

// GLTF-Transform
const io = new NodeIO();
const document = new Document();

const gltf_files = fs.readdirSync(outDir)
console.log(io.read('models/GLTF Out/Cone.gltf'))
// for (const file in gltf_files){
//     const fp = path.join(outDir, gltf_files[file]);
//     console.log(io.read(fp))
// }