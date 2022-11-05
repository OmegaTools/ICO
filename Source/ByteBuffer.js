
const ByteMask = 0b11111111;


export const Byte = 1;
export const Word = 2;
export const Quad = 4;


export class ByteBuffer {

    #buffer;
    #offset = 0;


    constructor ( size ){
        this.#buffer = new Uint8Array(size);
    }

    /*
     *  Write
     */

    write ( value , byteCount ){
        
        do {
            
            this.nextByte = value & ByteMask;
            
            value >>= 8;

        } while ( -- byteCount )

        return this;
    }

    writeByte ( byte ){
        return this.write(byte,1);
    }
        
    writeWord ( word ){
        return this.write(word,2);
    }

    writeQuad ( quad ){
        return this.write(quad,4);
    }
    
    byte ( byte ){
        return this.write(byte,1);
    }
        
    word ( word ){
        return this.write(word,2);
    }

    quad ( quad ){
        return this.write(quad,4);
    }
    
    // fill ( values ){
    // 
    //     while ( values.length ){
    // 
    //         const [ type , value ] = 
    //             values.splice(0,2);
    // 
    //         this.write(value,type);
    //     }
    // }


    get data (){
        return this.#buffer;
    }
        
    set nextByte ( value ){
        this.#buffer[this.#offset++] = value;
    }
}
