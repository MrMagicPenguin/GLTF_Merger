#! /usr/bin/env node

import {program} from "commander";
// import inquirer from 'inquirer'
import {merge} from "../lib/commands/merge.js"
import {seqMerge} from "../lib/commands/seq-merge.js";
import {prompt} from "../lib/commands/prompt.js";


program
    .command('merge <format> [inDir] [outDir] [delConversion]')
    .option('-d, --dry-run')
    .option('-dc, --delete-conversion')
    .alias('m')
    .description('Merge all .OBJ files in a directory into a single .GLTF/.GLB file')
    .action((format, inDir, outDir) => {
        merge(format, inDir, outDir).then(r => console.log("Merge complete!"))
        })

program
    .command('seq-merge <format> <inDir> <outDir> <delConversion>')
    .alias('sm')
    .description('Merge all .OBJ files in a directory into a single .GLTF/.GLB file with flipbook animation')
    .action(seqMerge)
// Interactive prompt for conversion

program
    .command('prompt')
    .alias('p')
    .description('Interactive prompt for conversion options')
    .action(prompt)
program.parse()