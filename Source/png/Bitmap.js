
import { calculatePoints } from './Interlace.js'
import { arrayOf } from './Utility.js'


const { ceil } = Math;



/*
 *  [Byte]
 *  [....]  ->  [Byte....Byte]
 *  [Byte]
 */

function bytesToValues(png){

    const { data , depth } = png;

    const bytesNeeded = ceil(depth / 8);

    if(bytesNeeded < 2)
        return;


    const size = data.length / bytesNeeded;

    png.data = arrayOf(size,0)
        .map(combine);

    function combine(value,index){
        
        for(let offset = 0;offset < bytesNeeded;offset++)
            value = (value << 8) + data[index + offset];

        return value;
    }
}



/*
 *  [Byte....Byte] -> [Depth] [Depth] [Depth] ...
 */

function breakIntoPieces(png){

    let { data , depth } = png;

    const values = ceil(8 / depth);

    if(values < 2)
        return;


    const mask = 2 ** depth - 1;

    data = [ ...data ]
        .map(splitValue)
        .flat();

    png.data = new Uint8Array(data);


    function splitValue(bits){
        return arrayOf(values)
            .map((_,index) => index * depth)
            .map((offset) => bits >> offset)
            .map((value) => value & mask);
    }
}



export default function Bitmap(png){

    const { bpp , size , data , depth , interlace } = png;

    bytesToValues(png)
    breakIntoPieces(png);

    const pixels = (depth > 8) 
        ? new Uint16Array(size) 
        : new Uint8Array(size) ;


    /*
     *  BPP | Type
     *  ----+-----
     *   1  | BW
     *   2  | BW + Alpha
     *   3  | RGB
     *   4  | RGB + Alpha
     */

    const
        hasAlpha = (bpp % 2) === 0,
        color_max = 2 ** depth - 1;
    
    const rgbOffsets = (bpp < 3)
        ? [ 0 , 0 , 0 ]
        : [ 0 , 1 , 2 ];

    if(hasAlpha)
        rgbOffsets.push(bpp - 1);


    interlace 
        ? copyAndAlign() 
        : copy();


    png.data = pixels;



    /*
     *  Copy Pixels
     */

    function copy(){
        for(let offset = 0;offset < data.length;offset += 4)
            writePixel(offset,offset);
    }


    /*
     *  Copy & Align Pixels
     */

    function copyAndAlign(){

        const { width , height } = png;

        let offset = -4;
        
        for(const target of calculatePoints(width,height))
            writePixel(offset += 4,target);
    }


    /*
     *  Write Pixel
     */

    function writePixel(source,target){
        
        const colors = [];

        for(const offset of rgbOffsets)
            colors.push(data[source + offset]);

        if(!hasAlpha)
            colors.push(color_max);


        for(let channel = 0;channel < 4;channel++)
            pixels[target + channel] = colors[channel];
    }
}
