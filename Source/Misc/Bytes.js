
const ByteMask = 0b11111111;


export function toBytes ( value , byteCount ){
    
    const bytes = [];
    
    while ( byteCount -- ){
        
        bytes.push(value & ByteMask);
        value >>= 8;
    }
    
    return bytes;
}
