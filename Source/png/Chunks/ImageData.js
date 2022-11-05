
import { inflate } from 'https://deno.land/std@0.162.0/node/zlib.ts';
import { zlib } from 'https://deno.land/std@0.162.0/node/internal_binding/constants.ts';

import { calculatePasses } from '../Interlace.js'
import normalize from '../Normalize.js'
import toBitmap from '../Bitmap.js'
import filter from '../Filter.js'


const { max , floor } = Math;
const { log } = console;


/**
 *  Parses the image data chunk.
 */
 
export default async function parse ( data , png ){

    const { width , height , bpp , depth , interlace } = png;


    /*
     *  Combine Data Chunks
     */

    data = new Uint8Array(
        data
        .map((a) => [...a])
        .flat()
    )

    log(data)


    /*
     *  Decompress
     */

    let options = {};
    
    if(!png.interlace){
        
        const size = height * (floor((width * bpp * depth + 7) * .125) + 1);
        
        options.chunkSize = max(size,zlib.Z_MIN_CHUNK);
    }
    
    await new Promise((resolve) => {
        // interlace 
        //     ? inflate(data,resolve) 
        //     : inflate(data,options,resolve);
            
        inflate(data,options,(error,buffer) => {
            data = buffer;
            resolve();
        });
    })
    
    log(data);
    
    if(!data)
        throw `Inflate wasn't created`;

    if(!data.length)
        throw `Invalid inflate length`;


    png.data = data;
    png.passes = interlace 
        ? calculatePasses(width,height) 
        : [ png ];


    /*
     *  Process
     */

    filter(png);
    toBitmap(png);
    normalize(png);
}
