import path from "path"
import obj2gltf from 'obj2gltf'
import {objDir} from "./commands/merge.js";

// TODO Return type can be narrowed down more specifically..
export async function ConverterFactory(type, targetFile) {
    if (type === "gltf") {
        console.log("Converting to GLTF")
        targetFile = path.join(objDir, targetFile)
        return _OBJtoGLTF(targetFile).then(file => {
                console.log("Converted to GLTF")
                return file
            }
        )
    }

    if (type === "glb") {
        return _OBJToGLB(targetFile)
    }

    function _OBJtoGLTF(name) {
        return obj2gltf(name)
            .then(function (gltf) {
                return Buffer.from(JSON.stringify(gltf))
            })
    }

    function _OBJToGLB(name) {
        return obj2gltf(name, {binary: true})
            .then(function (glb) {
                return Buffer.from(JSON.stringify(glb))
            })
    }

}