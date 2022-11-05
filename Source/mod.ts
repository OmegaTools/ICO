
import convert from './Convert.js'


export default async function toIcon ( buffers : Uint8Array [] ) : null | Buffer {
    return await convert(buffers);
}
