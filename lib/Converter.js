import path from "path"
import obj2gltf from 'obj2gltf'
import {inDir} from "./FileManager.js";

export async function ConverterFactory(type, targetFile) {
    if (type === "gltf") {
        targetFile = path.join(inDir, targetFile)
        return _OBJtoGLTF(targetFile).then(file => {
                return file
            }
        )
    }
    if (type === "glb") {
        targetFile =  path.join(inDir, targetFile)
        return _OBJToGLB(targetFile).then(file =>{
            return file
        })
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