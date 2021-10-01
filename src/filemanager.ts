import fs from "fs"
import path from "path";

export function makeDirectory(name: string){
    fs.mkdir(name,
        {recursive: true},
        (err) => {
            if (err){
                console.log(err);
            }
        });
}

export function changeExtension(file: string, extension: string){
    const basename = path.basename(file, path.extname(file))
    return path.join(path.dirname(file), basename + extension);
}

export function filterByType(files: string[], type: string){
    return files.filter(file => {
        return path.extname(file).toLowerCase() === type
    })

}

