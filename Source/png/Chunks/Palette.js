
/**
 *  Parses the color palette chunk.
 */
 
export default function parse ( data ){
    
    const palette = [];
    
    while ( data.length ){
        
        const [ r , g , b ] = data.splice(0,3);
        
        palette.push([ r , g , b , 255 ]);
    }
    
    return { palette }
}
