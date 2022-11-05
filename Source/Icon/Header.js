
import { Directory , Header } from './Sizes.js'

const
    Reserved = 0 ,
    Format = 1 ;


/**
 *  Write the icon header.
 */

export default function addHeader ( icon , imageCount ){

    icon.offset = Header 
        + Directory 
        * imageCount ;

    icon
    .prepareBuffer(header)
    .word(Reserved)
    .word(Format)
    .word(imageCount);
}
