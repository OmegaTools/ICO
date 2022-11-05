
import { Directory , Bitmap } from './Sizes.js'
import ByteArray from '../Misc/ByteArray.js'


const
    Color_Palette = 0 ,
    Color_Plane = 1 ,
    Reserved = 0 ;


/**
 *  Write an image dictionary.
 */

export default function addDictionary ( icon , options ){

    const 
        { width , height , bpp , data } = options ,
        { length } = data ;

    const 
        bitsPerPixel = bpp * 8 ,
        byteCount = Bitmap + length ;


    if(width === 256)
        width = 0;

    if(height === 256)
        height = 0;


    const bytes = new ByteArray(Directory);

    bytes
    .byte(width)
    .byte(height)
    .byte(Color_Palette)
    .byte(Reserved)
    .word(Color_Plane)
    .word(bitsPerPixel)
    .quad(byteCount)
    .quad(icon.offset)
    
    icon.buffers.push(bytes);
    icon.offset += byteCount;
    icon.length += Directory;
}
