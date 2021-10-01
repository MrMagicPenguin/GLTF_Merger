import path from "path";
import obj2gltf from 'obj2gltf'

// Change path string for output objects.
export function ChangeExtension(type: string, targetFiles: string, ext: string){
    const basename = path.basename(targetFiles, path.extname(targetFiles))
    return path.join(path.dirname(targetFiles), basename + ext)
}

// TODO Return type can be narrowed down more specifically..
export function ConverterFactory(type: string, targetFiles: string[]): any{
    if (type === "gltf"){
        for (const file in targetFiles){
            _OBJtoGLTF(targetFiles[file])
        }
    }
    if (type === "glb"){
        for (const file in targetFiles)
        _OBJToGLB(targetFiles[file])
    }

    function _OBJtoGLTF(name: string){
        obj2gltf(name)
            .then(function(gltf) {
                return Buffer.from(JSON.stringify(gltf))
            })
    }

    function _OBJToGLB(name: string){
        obj2gltf(name, {binary : true})
            .then(function(glb) {
                return Buffer.from(JSON.stringify(glb))
            })
    }

}