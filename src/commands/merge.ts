import path from "path"
import fs from 'fs'
import {filterByType, makeDirectory} from "../filemanager";
import {ConverterFactory} from "../Converter";

export function merge(format: string) {
    // Check for output type:
    const out_format = format.toLowerCase()

    // File Management
    const out_dir = path.join(process.cwd() + "GLTF_Out")
    const obj_dir = path.join(process.cwd() + "./TestModels/StressTestOBJ")

    // Create output folder if it does not exist
    makeDirectory(out_dir)
    // filter obj files from .mtl files
    const obj_files = filterByType(fs.readdirSync(obj_dir), ".obj")


    if (out_format === "gltf" || "glb"){
        console.log("Okay format! " + out_format)
        const files = ConverterFactory(out_format, obj_files)
        fs.writeFileSync(out_dir, files)
    }
    else {
        console.log("Please enter a valid format: GLTF or GLB")
    }


}

export default merge