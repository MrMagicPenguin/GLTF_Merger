import path from "path"
import fs from 'fs'
import {
    changeExtension,
    filterByType,
    makeDirectory,
    inDir,
    outDir
} from "../FileManager.js";
import {ConverterFactory} from "../Converter.js";
import {MergeOutput} from "../MergeOutput.js";
import {sequence} from "@gltf-transform/functions";


export async function merge(format, inputDir, outputDir, options) {
    // Handle defaults
    if (!inputDir) {
        console.log("No input directory, using default...")
        inputDir = inDir
    }
    if (!outputDir) {
        console.log("No output directory, using default...")
        outputDir = outDir
    }
    if (!options.filename) {
        options.filename = options.pattern
    }
    // Create output folders
    // TODO Handle dryrun not requiring output folder(s)
    makeDirectory(outputDir)
    if (options.sequence) {
        outputDir = outputDir + "Converted Frames/"
        makeDirectory(outputDir)
    }

    // Check for output type:
    const out_format = format.toLowerCase()
    if (out_format === "gltf" || "glb") {
        // filter obj files from .mtl files
        const obj_files = filterByType(fs.readdirSync(inputDir), ".obj")

        for (const obj in obj_files) {
            let file = await ConverterFactory(out_format, obj_files[obj])
            let fnOut = path.join(outputDir, changeExtension(path.basename(obj_files[obj]), "." + out_format))

            // TODO Handle DryRun logic, maybe invert?
            if (!options.dryRun) {
                fs.writeFileSync(fnOut, file)

            }
            // Get converted files into an array
            const out_files = filterByType(fs.readdirSync(outputDir), "." + out_format)

            // Merge converted files into single GLTF
            let gltf_doc = MergeOutput(out_files, out_format, outputDir, options.filename, options.dryRun, options.pattern);

            if (options.sequence) {
                console.log("Sequencing output frames...")
                gltf_doc.then(sequence())
                console.log("Sequencing Complete.")
            }
            if (!options.deleteConversion) {
                console.log("Deleting Converted Frames")
                fs.rmSync(outputDir, {recursive: true, force: true})
            }
        }
    }
    else {
        console.log("Please enter a valid format: GLTF or GLB")
    }
}