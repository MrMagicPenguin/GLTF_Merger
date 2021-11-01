import {Document, Material} from "@gltf-transform/core";

export default function DedupMaterials(document) {
    const root = document.getRoot()
    const root_mats = root.listMaterials()
    root_mats.forEach((mat) =>{
        if (mat.getName() === root_mats[0].getName() && mat !== root_mats[0]){
                mat.detach()
                mat.dispose()
            }
    })
}