#! /usr/bin/env node

import {program} from "commander";
// import inquirer from 'inquirer'
import {merge} from "../lib/commands/merge.js"


program
    .command('merge <format>')
    .description('Merge all .OBJ files in a directory into a single .GLTF/.GLB file')
    .action(merge)

program.parse()