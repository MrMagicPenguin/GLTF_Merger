#! /usr/bin/env node

import {program} from "commander";
import {merge} from "./commands/merge"


program
    .command('merge <format>')
    .description('Merge all .OBJ files in a directory into a single .GLTF/.GLB file')
    .action(merge)

program.parse()