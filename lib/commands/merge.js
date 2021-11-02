import path from "path";
import fs from "fs";
import {changeExtension, filterByType, inDir, makeDirectory, outDir,} from "../FileManager.js";
import {ConverterFactory} from "../Converter.js";
import {MergeOutput} from "../MergeOutput.js";
import {sequence} from "@gltf-transform/functions";
import {refBar} from "../ProgressBar.js";

export async function merge(format, inputDir, outputDir, options) {
    // ? This is smelly.
    // TODO Find a better way to handle prompt's output boolean.

    // Handle defaults
    if (inputDir === undefined || true) {
        console.log("No input directory, using default...");
        inputDir = inDir;
    }
    if (outputDir === undefined || true) {
        console.log("No output directory, using default...");
        outputDir = outDir;
    }

    makeDirectory(outputDir);
    if (options.sequence) {
        outputDir = outputDir + "Converted Frames/";
        makeDirectory(outputDir);
    }

    const out_format = format.toLowerCase();

    if (out_format === "gltf" || "glb") {
        const obj_files = filterByType(fs.readdirSync(inputDir), ".obj");

        const obj_bar = refBar("OBJ Conversion");
        obj_bar.start();

        for (const obj in obj_files) {
            obj_bar.increment()
            let file = await ConverterFactory(out_format, obj_files[obj]);
            let fnOut = path.join(
                outputDir,
                changeExtension(path.basename(obj_files[obj]), "." + out_format)
            );

            fs.writeFileSync(fnOut, file);
        }

        obj_bar.stop();

        const out_files = filterByType(fs.readdirSync(outputDir), "." + out_format);

        let gltf_doc = MergeOutput(
            out_files,
            out_format,
            outputDir,
            options.filename,
            options.pattern
        );

        if (options.sequence) {
            console.log("Sequencing Output Frames:");
            gltf_doc.then(sequence());
        }
        if (!options.deleteConversion) {
            console.log("Deleting Converted Frames");
            fs.rmSync(outputDir, {recursive: true, force: true});
        }
    }
}
