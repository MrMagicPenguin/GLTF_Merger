import inquirer from 'inquirer'
import path from 'path'
import {validatePath, directoryHandler} from "../FileManager.js";

console.log("GLTF-Merger Interactive Help")
const questions = [
    {
        type: 'expand',
        name: 'filetype',
        message: 'Convert to GLTF or GLB?',
        choices: [
            {
                key: 'g',
                name: 'GLTF - ASCII/JSON',
                value: 'gltf',
            },
            {
                key: 'b',
                name: 'GLB - BINARY',
                value: 'glb'
            },
        ]
    },

    {
        type: 'confirm',
        name: 'useCWDIn',
        message: `Convert files in this directory: ${process.cwd()}?`,
        default: true,
    },

    {
        type: 'input',
        name: 'customDirIn',
        message: 'Define new input directory:',
        validate: async (dir) => {
            let validation = await validatePath(dir)
            if (validation){
                console.log("Path OK!")
                return true
            }
            else {
                return "Not a valid path, try again:"
            }
        },
        when(answers){
            return !directoryHandler('useCWDOut')(answers)
        },
    },

    {
        type: 'confirm',
        name: 'useCWDOut',
        message: `Export finished files to new subdirectory: ${path.join(process.cwd() + "/GLTF_Out/")}`,
        default: true,
    },

    {
        type: 'input',
        name: 'customDirOut',
        message: 'Define new output directory:',
        validate: async (dir) => {
            let validation = await validatePath(dir)
            if (validation){
                console.log("Path OK!")
                return true
            } else {
                return "Not a valid path, try again:"
            }
        },
        when(answers){
            return !directoryHandler('useCWDOut')(answers)
        },
    },

    {
        type: 'confirm',
        name: 'delGLTFConversion',
        message: 'Delete converted .GLTF/.GLB frames?',
        default: true,
    },
    {
        type: 'confirm',
        name: 'sequence',
        message: 'Convert output to flipbook animation sequence?',
        default: true,
    }
]
inquirer.prompt(questions).then((answers) => {
    console.log(JSON.stringify(answers, null, '  '))
})
