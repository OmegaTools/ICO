
import ByteArray from '../Misc/ByteArray.js'


/**
 *  Write bitmap color data.
 */

export default function addBitmapData ( icon , options ){

    const 
        { width: w , height : h , bpp , data } = options ,
        { length } = data ;


    const bytes = new ByteArray(length);

    for ( let y = h - 1 ; y >= 0 ; y-- )
        for ( let x = 0 ; x < w ; x++ )
            copyPixel((y * w + x) * bpp);


    icon.buffers.push(bytes);
    icon.length += length;


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
