


// import { inflate } from 'https://deno.land/x/denoflate@1.2.1/mod.ts';
// import { inflate } from 'https://deno.land/x/zlib.es@v1.0.0/inflate.ts';


import { deepMerge } from 'https://deno.land/std@0.162.0/collections/mod.ts';

import parseTransparency from './Chunks/Transparency.js'
import parseImageData from './Chunks/ImageData.js'
import parsePalette from './Chunks/Palette.js'


const { log } = console;

const
    signature = [ 0x89 , 0x50 , 0x4e , 0x47 , 0x0d , 0x0a , 0x1a , 0x0a ],
    colorTypeToBPP = {
        0 : 1 , // Grayscale (1)
        2 : 3 , // RGB (3)
        3 : 1 , // Indexed (Palette) (1)
        4 : 2 , // Grayscale (1) + Alpha (1)
        6 : 4   // RGB (3) + Alpha (1)
    };



export default async function parse(buffer){
    
    function byteAt(buffer,offset){
        return buffer[offset];
    }
    
    function wordAt(buffer,offset){
        return buffer[offset + 0] << 8 
             | buffer[offset + 1] << 0 ;
    }
    
    function dwordAt(buffer,offset){
        return wordAt(buffer,offset + 0) << 16
             | wordAt(buffer,offset + 2) <<  0 ;
    }
    
    

    /*
     *  Signature
     */

    {
        
        for(let i = 0;i < 8;i++)
            if(signature[i] !== buffer[i])
                throw `Buffer data has non-png signature: [${ buffer }]`;
    
    }

    
    // function v(o){
    //     let val =         buffer[o];
    //     if(val === 152)
    //         val = 'X';
    //     return '\t' + val;
    // }

    // 
    // for(let b = 0;b < buffer.length;b += 8)
    // log(
    //     v(b + 0) ,
    //     v(b + 1) ,
    //     v(b + 2) ,
    //     v(b + 3) ,
    //     v(b + 4) ,
    //     v(b + 5) ,
    //     v(b + 6) ,
    //     v(b + 7) ,
    // )

    const chunks = new Map;
    chunks.set('IDAT',[]);


    /*
     *  Read Chunks
     */

    {
        let offset = 8;

        while(offset < buffer.length){

            const size = dwordAt(buffer,offset);
                
            const type = buffer
                .subarray(offset += 4,offset += 4);
                    
            const data = buffer
                .subarray(offset,offset += size);
            
            const checksum = buffer
                .subarray(offset,offset += 4);
                
                
            const block = new TextDecoder()
                .decode(type);


            log(type,block)

            if(block !== 'IDAT'){
                chunks.set(block,data);
                continue;
            }
                
            chunks
            .get('IDAT')
            .push(data);
        }
    }

    
    log(chunks);


    let png;


    /*
     *  Properties
     */

    {
        const
            data = chunks.get('IHDR'),
            type = data[9];

        const
            width = dwordAt(data,0) ,
            height = dwordAt(data,4) ;

        png = {

            bpp: colorTypeToBPP[type],

            size: height * width * 4,

            color:       Boolean(type & 0x2),
            transparent: Boolean(type & 0x4),

            depth:       data[8],
            filter:      data[11],
            interlace:   data[12],
            compression: data[10],

            type , width , height
        }
        
        log(png)
    }
    
    
    //  Order Matters
    
    const chunkTypes = [
        [ 'PLTE' , parsePalette ] ,
        [ 'tRNS' , parseTransparency ] ,
        [ 'IDAT' , parseImageData ]
    ]
    
    for ( const [ type , parser ] of chunkTypes ){
        
        const data = chunks.get(type);
        
        if(data){
            
            const parsed = await parser(data,png) ?? {};
            
            png = deepMerge(png,parsed);
        }
    }
    

    // /*
    //  *  Color Palette
    //  */
    // 
    // if(chunks.has('PLTE')){
    // 
    //     const
    //         palette = [],
    //         data = chunks.get('PLTE');
    // 
    //     for(let d = 0,p = 0;d < data.length / d;d += 3,p++)
    //         palette[p] = [ data[d] , data[d + 1] , data[d + 2] , 255 ];
    // 
    //     png.palette = palette;
    // }

    // 
    // /*
    //  *  Transpancy
    //  */
    // 
    // if(chunks.has('tRNS')){
    // 
    //     png.transparent = true;
    // 
    //     const
    //         { type , palette } = png ,
    //         data = chunks.get('tRNS') ;
    // 
    //     let offset = 0;
    // 
    //     switch(type){
    //     case 0: // Grayscale
    //         png.transparency = [ readByte() ];
    //         break;
    //     case 2: // RGB
    //         png.transparency = [ readByte() , readByte() , readByte() ];
    //         break;
    //     case 3: // RGB + Palette
    //         data.forEach((alpha,index) => palette[3] = alpha);
    //         break;
    //     }
    // 
    //     function readByte(){
    //         const byte = byteAt(data,offset);
    //         offset++;
    //         return byte;
    //     }
    // }



    // /*
    //  *  Image Data
    //  */
    // 
    // {
    //     const { width , height , bpp , depth , interlace } = png;
    // 
    //     let data = chunks.get('IDAT');
    // 
    // 
    //     /*
    //      *  Combine Data Chunks
    //      */
    // 
    //     data = new Uint8Array(
    //         data
    //         .map((a) => [...a])
    //         .flat()
    //     );
    // 
    //     log(data)
    // 
    //     /*
    //      *  Decompress
    //      */
    // 
    //     let options = {};
    // 
    //     if(!png.interlace){
    // 
    //         const size = height * (floor((width * bpp * depth + 7) * .125) + 1);
    // 
    //         options.chunkSize = max(size,zlib.Z_MIN_CHUNK);
    //     }
    // 
    //     await new Promise((resolve) => {
    //         // interlace 
    //         //     ? inflate(data,resolve) 
    //         //     : inflate(data,options,resolve);
    // 
    //         inflate(data,options,(error,buffer) => {
    //             data = buffer;
    //             resolve();
    //         });
    //     })
    // 
    //     log(data);
    // 
    //     if(!data)
    //         throw `Inflate wasn't created`;
    // 
    //     if(!data.length)
    //         throw `Invalid inflate length`;
    // 
    // 
    //     png.data = data;
    //     png.passes = interlace 
    //         ? calculatePasses(width,height) 
    //         : [ png ];
    // 
    // 
    //     /*
    //      * Process
    //      */
    // 
    //     filter(png);
    //     toBitmap(png);
    //     normalize(png);
    // }

    return png;
}
