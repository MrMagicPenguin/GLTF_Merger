import path from "path"
import fs from 'fs'
import {
    changeExtension,
    filterByType,
    makeDirectory,
    deleteConversionFrames,
    inDir,
    outDir
} from "../FileManager.js";
import {ConverterFactory} from "../Converter.js";
import {MergeOutput} from "../MergeOutput.js";
import {sequence} from "@gltf-transform/functions";


export async function merge(format, inputDir=inDir, outputDir=outDir, options) {
    // Check for output type:
    const out_format = format.toLowerCase()
    // Create output folders
    // TODO Handle dryrun not requiring output folder(s)
    makeDirectory(outputDir)
    if (options.sequence){
        outputDir = outputDir + "Converted Frames/"
        makeDirectory(outputDir)
        console.log(outputDir)
        }
    // filter obj files from .mtl files
    const obj_files = filterByType(fs.readdirSync(inputDir), ".obj")
    console.log(options)
    if (out_format === "gltf" || "glb") {
        console.log("Okay format! " + out_format)
        for (const obj in obj_files) {
            let file = await ConverterFactory(out_format, obj_files[obj])
            let fnOut = path.join(outputDir, changeExtension(path.basename(obj_files[obj]), "." + out_format))

            if (!options.dryRun)
                fs.writeFileSync(fnOut, file)
            //else
                //console.log("converted file %s", obj)
        }
        console.log("Conversion Complete!")
        const out_files = filterByType(fs.readdirSync(outputDir), "." + out_format)
        // Merge into single GLTF
        let gltf_doc = MergeOutput(out_files, out_format, outputDir, options.filename, options.dryRun);

        if (options.sequence){
            console.log("Sequencing...")
            gltf_doc.then(sequence())
            console.log("Sequencing Complete.")
        }

        if (options.deleteConversion)
        {
            console.log("Deleting Converted Frames")
            fs.rmSync(outputDir, {recursive: true, force: true})
        }
    } else {
        console.log("Please enter a valid format: GLTF or GLB")
    }
}