import path from "path"
import fs from 'fs'
import {changeExtension, filterByType, makeDirectory, inDir, outDir} from "../FileManager.js";
import {ConverterFactory} from "../Converter.js";
import {MergeOutput} from "../MergeOutput.js";


export async function merge(format, inputDir=inDir, outputDir=outDir, delConversion=false) {
    // Check for output type:
    const out_format = format.toLowerCase()


    // Create output folder if it does not exist
    makeDirectory(outputDir)

    // filter obj files from .mtl files
    const obj_files = filterByType(fs.readdirSync(inputDir), ".obj")

    if (out_format === "gltf" || "glb") {
        console.log("Okay format! " + out_format)
        for (const obj in obj_files) {
            let file = await ConverterFactory(out_format, obj_files[obj])
            let fnOut = path.join(outputDir, changeExtension(path.basename(obj_files[obj]), "." + out_format))
            fs.writeFileSync(fnOut, file)
        }
        console.log("Conversion Complete!")
        // Merge into single GLTF
        const out_files = filterByType(fs.readdirSync(outputDir), "." + out_format)
        MergeOutput(out_files, out_format)
    } else {
        console.log("Please enter a valid format: GLTF or GLB")
    }


}

export default merge