

import toPNG from './png/Parse.js'
import Icon from './Icon.js'


/*
 *  Buffers -> ICO Buffer
 */

export default async function convert(buffers){

    if(!buffers)
        return null;

    if(!Array.isArray(buffers))
        buffers = [ buffers ];

    if(buffers.length < 1)
        return null;


    const
        icon = new Icon,
        processes = await Promise.all(buffers.map(toPNG)),
        images = await Promise.all(processes);


    /*
     *  Header
     */

    icon.addHeader(images.length);


    /*
     *  Dictionaries
     */

    for(const image of images)
        icon.addDictionary(image);


    /*
     *  Content
     */

    for(const image of images){
        icon.addBitmapHeader(image);
        icon.addBitmapData(image);
    }


    return icon.export();
}
