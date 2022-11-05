
import { Directory , Bitmap } from './Sizes.js'
import ByteArray from '../Misc/ByteArray.js'


const
    Horizontal_Resolution = 0 ,
    Vertical_Resolution = 0 ,
    Important_Colors = 0 ,
    Used_Colors = 0 ,
    Compression = 0 ,
    Planes = 1 ;


/**
 *  Write a bitmap header.
 */

export default function addBitmapHeader ( icon , options ){

    const 
        { width , height , bpp , size , data } = options ,
        { length } = data ;

    const
        imageSize = length ,
        colorMode = bpp * 8 ;


    const bytes = new ByteArray(Bitmap);

    bytes
    .quad(Bitmap)
    .quad(width)
    .quad(height)
    .word(Planes)
    .word(colorMode)
    .quad(Compression)
    .quad(imageSize)
    .quad(Horizontal_Resolution)
    .quad(Vertical_Resolution)
    .quad(Used_Colors)
    .quad(Important_Colors)
    
    icon.buffers.push(bytes);
    icon.length += Bitmap;
}
