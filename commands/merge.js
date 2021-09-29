import path from "path"
import fs from 'fs'
import {makeDirectory} from "../filemanager";

export function merge(format) {
    // Check for output type:
    const out_format = format.toLowerCase()

    if (out_format === "gltf" || "glb"){
        console.log("Okay format!")
    }
    else {
        console.log("Please enter a valid format: GLTF or GLB")
    }

    // File Management
    const out_dir = path.join(process.cwd() + "GLTF_Out")
    const obj_dir = path.join(process.cwd() + "ObjSeq")
    // Create output folder if it does not exist
    makeDirectory(out_dir)





}

export default merge