
import { Directory , Header } from './Sizes.js'
import ByteArray from '../Misc/ByteArray.js'


const
    Reserved = 0 ,
    Format = 1 ;


/**
 *  Write the icon header.
 */

export default function addHeader ( icon , imageCount ){

    const bytes = new ByteArray(Header);
    
    bytes
    .word(Reserved)
    .word(Format)
    .word(imageCount);
    
    icon.buffers.push(bytes);
    
    icon.offset += Header 
    icon.offset += Directory * imageCount;
        
    icon.length += Header;
}
