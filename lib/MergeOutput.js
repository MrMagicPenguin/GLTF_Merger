import {Document, NodeIO} from "@gltf-transform/core";
import {dedup, prune} from "@gltf-transform/functions";
import path from "path";
import DedupMaterials from "./DedupMaterials.js";
import {outDir} from "./FileManager.js";
import {refBar} from "./ProgressBar.js";

export async function MergeOutput(files, format, outputDir, name) {
    const io = new NodeIO();
    const document = new Document();

    if (name === undefined) {
        name = path.basename(files[0], "." + format);
        name = name.replace(/[0-9]/gm, "");
    }

    for (const file in files) {
        const fp = path.join(outputDir, files[file]);
        document.merge(io.read(fp));
    }

    const root = document.getRoot();
    const rootBuffer = root.listBuffers()[0];
    root.setName("Root");
    const mainScene = root.listScenes()[0];

    // Condense children of each scene into mainScene
    root.listAccessors().forEach((a) => a.setBuffer(rootBuffer));
    // Remove extra buffers from each child unless they are in the main scene
    root.listBuffers().forEach((b, index) => (index > 0 ? b.dispose() : null));

    let scenes = root.listScenes();

    const merge_bar = refBar("Merging files");
    merge_bar.start(files.length, 0);

    // Rename child objects for sequencing, readability
    for (const scene of scenes) {
        merge_bar.increment();
        if (scene === mainScene) {
            continue;
        }
        for (const child of scene.listChildren()) {
            child.setName(`Frame_${child}`);
            mainScene.addChild(child);
        }
        scene.dispose();
    }

    merge_bar.stop();

    DedupMaterials(document);

    document
        .transform(() => {
            prune();
            dedup();
        })
        .then((d) => io.write(path.join(outDir, name + "." + format), d));
    return document;
}
