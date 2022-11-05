
import { toBytes } from './Bytes.js'


export default class ByteArray extends Uint8Array {
    
    #offset = 0
    
    #write ( value , byteCount ){

        const bytes = toBytes(value,byteCount);

        this.set(bytes,this.#offset);

        this.#offset += byteCount;
        
        return this
    }
    
    byte ( value ){
        return this.#write(value,1)
    }
    
    word ( value ){
        return this.#write(value,2)
    }
    
    quad ( value ){
        return this.#write(value,4)
    }
}
