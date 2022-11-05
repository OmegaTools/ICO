
/**
 *  Parses the transparency chunk.
 */
 
export default function parse ( data , png ){

    const { type , palette } = png;

    
    //  Read 🠖 Increment 🠖 Return
    
    const readByte = () =>
        data[offset++];
    

    let transparency;
    let offset = 0;

    switch(type){
    case 0 : // Grayscale
        transparency = [ readByte() ];
        break;
    case 2 : // RGB
        transparency = [ readByte() , readByte() , readByte() ];
        break;
    case 3 : // RGB + Palette
        
        data.forEach((alpha,index) => {
            palette[index * 4 + 3] = alpha;
        })
        
        break;
    }

    return { 
        transparent : true , 
        transparency 
    }
}
