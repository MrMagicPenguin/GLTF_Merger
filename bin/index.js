#! /usr/bin/env node

import {program} from "commander";
// import inquirer from 'inquirer'
import {merge} from "../lib/commands/merge.js"
import {seqMerge} from "../lib/commands/seq-merge.js";
import {prompt} from "../lib/commands/prompt.js";


program
    .command('merge <format> [inDir] [outDir]')
    .option('-d, --dry-run')
    .option('-s, --sequence', 'Convert output to flipbook animation')
    .option('-dc, --delete-conversion', 'Delete all converted frames')
    .option('-fn, --filename <name>', 'Name of output file')
    .alias('m')
    .description('Merge all .OBJ files in a directory into a single .GLTF/.GLB file')
    .action((format, inDir, outDir, options) => {
        merge(format, inDir, outDir, options)
            .then(() => console.log("Merge complete!"))
        })

// Interactive prompt for conversion
program
    .command('prompt')
    .alias('p')
    .description('Interactive prompt for conversion options')
    .action(prompt)

program.parse()