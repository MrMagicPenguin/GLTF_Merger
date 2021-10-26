import fs from "fs"
import path from "path";

// TODO Add checks for user passing these as variables instead...
export var outDir = path.join(process.cwd() + "/GLTF_Out/")
export var inDir = path.join(process.cwd())

export function makeDirectory(name){
    fs.mkdir(name,
        {recursive: true},
        (err) => {
            if (err){
                console.log(err);
            }
        });
}

export function changeExtension(file, extension){
    const basename = path.basename(file, path.extname(file))
    return path.join(path.dirname(file), basename + extension);
}

export function filterByType(files, type){
    return files.filter(file => {
        return path.extname(file).toLowerCase() === type
    })
}

export function validatePath(path){
    return fs.promises.access(path, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
}
export function directoryHandler(choice) {
    return function (answers) {
        return answers[choice];
    }
}