
import { concat } from './Imports.ts'
import toPNG from './png/Parse.js'
import Icon from './Icon.js'

import addBitmapHeader from './Icon/BitmapHeader.js'
import addDictionary from './Icon/Dictionary.js'
import addBitmapData from './Icon/BitmapData.js'
import addHeader from './Icon/Header.js'


/**
 *  Buffers -> ICO Buffer
 */

export default async function convert(buffers){

    if(!buffers)
        return null;

    if(!Array.isArray(buffers))
        buffers = [ buffers ];


    const imageCount = buffers.length;

    if(imageCount < 1)
        return null;


    const
        processes = await Promise.all(buffers.map(toPNG)) ,
        images = await Promise.all(processes) ;


    const icon = {
        buffers : [] ,
        length : 0 ,
        offset : 0
    }


    addHeader(icon,imageCount);

    for(const image of images)
        addDictionary(icon,image);

    for(const image of images){
        addBitmapHeader(icon,image);
        addBitmapData(icon,image);
    }
    

    return concat( ... icon.buffers )
}
