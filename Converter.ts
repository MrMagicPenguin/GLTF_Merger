import path from "path";
import obj2gltf from 'obj2gltf'
// Change path string for output objects.
export function ChangeExtension(type: string, targetFiles: string, ext: string){
    const basename = path.basename(targetFiles, path.extname(targetFiles))
    return path.join(path.dirname(targetFiles), basename + ext)
}

export function ConverterFactory(type: string, targetFiles: string[]){
    if (type === "gltf"){
        for (const file in targetFiles){
            return OBJToGLTF(targetFiles[file])
        }
    }
    if (type === "glb"){
        for (const file in targetFiles)
        return OBJToGLB(targetFiles[file])
    }

    function OBJToGLTF(name: string){
        obj2gltf(name)
            .then(function(gltf) {
                const data = Buffer.from(JSON.stringify(gltf))
                return data
            })
    }

    function OBJToGLB(name: string){
        obj2gltf(name, {binary : true})
            .then(function(glb) {
                const data = Buffer.from(JSON.stringify(glb))
                return data
            })
    }

}