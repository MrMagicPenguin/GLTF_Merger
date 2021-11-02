import path from "path";
import {directoryHandler, validatePath} from "../FileManager.js";

export const questions = [
    {
        type: "list",
        name: "baseFormat",
        message: "Start with OBJ or GLTF/GLB file?",
        choices: [
            {
                key: "obj",
                name: ".OBJ (Wavefront)",
                value: "obj",
            },
            {
                key: "gltf",
                name: ".GLTF/.GLB",
                value: "gltf",
            },
        ],
    },

    {
        type: "list",
        name: "fileType",
        message: "Convert to GLTF or GLB?",
        choices: [
            {
                key: "gltf",
                name: "GLTF - ASCII/JSON",
                value: "gltf",
            },
            {
                key: "glb",
                name: "GLB - BINARY",
                value: "glb",
            },
        ],
    },

    {
        type: "confirm",
        name: "sequence",
        message: "Convert output to flipbook animation sequence?",
        default: true,
    },

    {
        type: "confirm",
        name: "useCWDIn",
        message: `Convert files in this directory: ${process.cwd()}?`,
        default: true,
    },

    {
        type: "input",
        name: "customDirIn",
        message: "Define new input directory:",
        validate: async (dir) => {
            let validation = await validatePath(dir);
            if (validation) {
                console.log("Path OK!");
                return true;
            } else {
                return "Not a valid path, try again:";
            }
        },
        when(answers) {
            return !directoryHandler("useCWDIn")(answers);
        },
    },

    {
        type: "confirm",
        name: "useCWDOut",
        message: `Export finished files to new subdirectory: ${path.join(
            process.cwd() + "/GLTF_Out/"
        )}`,
    },

    {
        type: "input",
        name: "customDirOut",
        message: "Define new output directory:",
        validate: async (dir) => {
            let validation = await validatePath(dir);
            if (validation) {
                console.log("Path OK!");
                return true;
            } else {
                return "Not a valid path, try again:";
            }
        },
        when(answers) {
            return !directoryHandler("useCWDOut")(answers);
        },
    },

    {
        type: "confirm",
        name: "delGLTFConversion",
        message: "Delete converted .GLTF/.GLB frames?",
        default: true,
    },
];
