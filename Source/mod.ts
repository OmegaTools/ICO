
import convert from './Convert.js'


export async function fromPNGs ( buffers : Uint8Array [] ) : null | Buffer {
    return await convert(buffers);
}
