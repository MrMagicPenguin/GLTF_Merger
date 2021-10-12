import path from "path"
import fs from 'fs'
import {changeExtension, filterByType, makeDirectory} from "../FileManager.js";
import {ConverterFactory} from "../Converter.js";

// File Management
// TODO Add checks for user passing these as variables instead...
export const outDir = path.join(process.cwd() + "/GLTF_Out/")
export const objDir = path.join(process.cwd() + "/OBJSequence")

export async function merge(format) {
    // Check for output type:
    const out_format = format.toLowerCase()

    // Create output folder if it does not exist
    makeDirectory(outDir)
    // filter obj files from .mtl files
    const obj_files = filterByType(fs.readdirSync(objDir), ".obj")


    if (out_format === "gltf" || "glb") {
        console.log("Okay format! " + out_format)
        for (const obj in obj_files) {
            let file = await ConverterFactory(out_format, obj_files[obj])
            let fnOut = path.join(outDir, changeExtension(path.basename(obj_files[obj]), "." + out_format))
            fs.writeFileSync(fnOut, file)
        }

        // if (sequence !== false) {
        //     // Create Sequence from all .GLTF/.GLB files in outDir
        //     const files = fs.readdirSync(outDir).filter((file => {
        //         return path.extname(file).toLowerCase() === out_format
        //     }))
        //     //MergeOutput(files)

        //}
    } else {
        console.log("Please enter a valid format: GLTF or GLB")
    }


}

export default merge