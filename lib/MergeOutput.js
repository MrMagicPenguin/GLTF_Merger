import {Document, NodeIO} from "@gltf-transform/core";
import {dedup, prune} from "@gltf-transform/functions";
import path from "path";
import DedupMaterials from './DedupMaterials.js'
import {outDir} from "./FileManager.js";

export async function MergeOutput(files, format, outputDir, name, dryRun) {
    console.log("Begin Merger")
    const io = new NodeIO()
    const document = new Document()
    // Load all .GLTF/.GLB files and merge them into one document

    for (const file in files) {
        const fp = path.join(outputDir, files[file])
        document.merge(io.read(fp))
    }

    const root = document.getRoot()
    const rootBuffer = root.listBuffers()[0]
    root.setName("Root")
    const mainScene = root.listScenes()[0]

    // Condense children of each scene into mainScene
    root.listAccessors().forEach((a) => a.setBuffer(rootBuffer))
    // Remove extra buffers from each child unless they are in the main scene
    root.listBuffers().forEach((b, index) => index > 0 ? b.dispose() : null)

    let scenes = root.listScenes()
    // Rename child objects
    for (const scene of scenes) {
        if (scene === mainScene) {
            continue
        }
        for (const child of scene.listChildren()) {
            child.setName(`Frame_${child}`)
            mainScene.addChild(child)

        }
        scene.dispose()
    }

    DedupMaterials(document)
    if (!dryRun) {
        document.transform(() => {
            prune()
            dedup()
        })
            .then(d => io.write(path.join(outDir, name + "." + format), d))
    }
    else
        console.log("DryRun Transform complete.")
    return document
}