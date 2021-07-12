import {Document, NodeIO} from '@gltf-transform/core';
import path from "path";
import fs from 'fs';
import obj2gltf from 'obj2gltf'

// probably change to cwd when converted to actual Node script
// For some reason this pathname is the only way to make it work
const folder = path.dirname('./models/models');

// Read all files in dir
const files = fs.readdirSync(folder);

// Select required files
const targetFiles =  files.filter(file => {
    return path.extname(file).toLowerCase() === ".obj";
})
console.log(targetFiles)

// convert OBJ to GLTF
// for (const file in targetFiles){
//     obj2gltf(file)
//         .then(function (gltf){
//             const data = Buffer.from(JSON.stringify(gltf));
//             fs.writeFileSync(file, data);
//         });
// }