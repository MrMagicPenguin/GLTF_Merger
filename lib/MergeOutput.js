import {Document, NodeIO} from "@gltf-transform/core";
import {dedup, prune} from "@gltf-transform/functions";
import {outDir} from "./FileManager.js";
import path from "path";

export function MergeOutput(files, format){
    console.log("Begin Merger")
    const io = new NodeIO()
    const document = new Document()

    // Load all .GLTF/.GLB files and merge them into one document
    for (const file in files){
        const fp = path.join(outDir, files[file])
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

    // Rename child objects
    for (const scene of root.listScenes()){
        if (scene === mainScene){
            continue
        }
        for (const child of scene.listChildren()){
            child.setName(`Frame_${child}`)
            mainScene.addChild(child)
        }
        scene.dispose()
    }
    document.transform(prune()).then(r => io.write(path.join(outDir, "model" + "." + format), document))


}