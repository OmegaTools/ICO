#!/usr/bin/env -S deno run --allow-all

import { fromPNGs } from '../Source/mod.ts'
import * as Paths from './Paths.js'


const 
    { writeFile , readFile } = Deno ,
    { clear , log } = console ;


clear();
log('\n'.repeat(10));


//  Collect the image bytes / buffers.

const buffers = [];

for(const path of Paths.images){
    
    const bytes = 
        await readFile(path);
    
    buffers.push(bytes);
}


//  Convert the buffers into an icon.
    
const icon = await fromPNGs(buffers);


//  Save the icon.

await writeFile(Paths.icon,icon);
