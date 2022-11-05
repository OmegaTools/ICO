
import ByteArray from '../Misc/ByteArray.js'


/**
 *  Write bitmap color data.
 */

export default function addBitmapData ( icon , options ){

    const { width , height , bpp , data } = options;
        
    const pixelCount = data.length;


    const bytes = new ByteArray(pixelCount);

    for ( let y = height - 1 ; y >= 0 ; y-- )
        for ( let x = 0 ; x < width ; x++ )
            copyPixel((y * width + x) * bpp);


    icon.buffers.push(bytes);
    icon.length += pixelCount;


    /*
     *  Copy Color
     */

    function copyColor(index){
        bytes.byte(data[index]);
    }


    /*
     *  Copy Pixel
     */

    function copyPixel(index){

        for ( let c = 2 ; c >= 0 ; c-- )
            copyColor(index + c);

        copyColor(index + 3);
    }
}
