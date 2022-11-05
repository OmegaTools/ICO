
// import { ByteBuffer , Byte , Word , Quad } from './ByteBuffer.js'


/*
 *  Sizes
 */

const Size = {
    directory : 16 ,
    header : 6 ,
    bmp : 40
}


/*
 *  Icon Class
 */

export default class Icon {

    #buffers = [];
    #length = 0;
    #offset = 0;

    // 
    // /*
    //  *  ICO Header
    //  */
    // 
    // addHeader(imageCount){
    // 
    //     const { directory , header } = Size;
    // 
    // 
    //     this.#offset = header 
    //         + directory 
    //         * imageCount ;
    // 
    //     const
    //         Reserved = 0 ,
    //         Format = 1 ;
    // 
    //     this
    //     .prepareBuffer(header)
    //     .word(Reserved)
    //     .word(Format)
    //     .word(imageCount);
    // }
    // 
    // 
    // /*
    //  *  Image Dictionary
    //  */
    // 
    // addDictionary({ width , height , bpp , data }){
    // 
    //     const { length } = data;
    // 
    //     const 
    //         bitsPerPixel = bpp * 8 ,
    //         byteCount = Size.bmp + length ;
    // 
    // 
    //     if(width === 256)
    //         width = 0;
    // 
    //     if(height === 256)
    //         height = 0;
    // 
    // 
    //     const
    //         Color_Palette = 0 ,
    //         Color_Plane = 1 ,
    //         Reserved = 0 ;
    // 
    //     this
    //     .prepareBuffer(Size.directory)
    //     .byte(width)
    //     .byte(height)
    //     .byte(Color_Palette)
    //     .byte(Reserved)
    //     .word(Color_Plane)
    //     .word(bitsPerPixel)
    //     .quad(byteCount)
    //     .quad(this.offset)
    // 
    //     this.#offset += byteCount;
    // }


    // /*
    //  *  BMP Header
    //  */
    // 
    // addBitmapHeader({ width , height , bpp , size , data }){
    // 
    //     const
    //         imageSize = data.length ,
    //         colorMode = bpp * 8 ;
    // 
    //     const
    //         Horizontal_Resolution = 0 ,
    //         Vertical_Resolution = 0 ,
    //         Important_Colors = 0 ,
    //         Header_Size = 40 ,
    //         Used_Colors = 0 ,
    //         Compression = 0 ,
    //         Planes = 1 ;
    // 
    // 
    //     this
    //     .prepareBuffer(Header_Size)
    //     .quad(Header_Size)
    //     .quad(width)
    //     .quad(height)
    //     .word(Planes)
    //     .word(colorMode)
    //     .quad(Compression)
    //     .quad(imageSize)
    //     .quad(Horizontal_Resolution)
    //     .quad(Vertical_Resolution)
    //     .quad(Used_Colors)
    //     .quad(Important_Colors)
    // }


    // /*
    //  *  BMP Data
    //  */
    // 
    // addBitmapData({ width: w , height: h , bpp , data }){
    // 
    //     const pixels = this.prepareBuffer(data.length);
    // 
    //     for(let y = h - 1;y >= 0;y--)
    //         for(let x = 0;x < w;x++)
    //             copyPixel((y * w + x) * bpp);
    // 
    // 
    // 
    //     /*
    //      *  Copy Color
    //      */
    // 
    //     function copyColor(index){
    //         pixels.writeByte(data[index]);
    //     }
    // 
    // 
    //     /*
    //      *  Copy Pixel
    //      */
    // 
    //     function copyPixel(index){
    // 
    //         for(let c = 2;c >= 0;c--)
    //             copyColor(index + c);
    // 
    //         copyColor(index + 3);
    //     }
    // }

    // 
    // /*
    //  *  Append Buffer
    //  */
    // 
    // prepareBuffer(size){
    // 
    //     const buffer = new ByteBuffer(size);
    // 
    //     const { data } = buffer;
    // 
    //     this.#buffers.push(buffer);
    //     this.#length += data.length;
    // 
    //     return buffer;
    // }


    /*
     *  Export
     */

    export(){
        
        const buffers = this.#buffers;
        
        const data = buffers
            .map(({ data }) => data)
            .map((data) => [ ... data ])
            .flat();
            
        return new Uint8Array(data);
        // this.#buffers.map((b) => [...b]).flat());
    }
    
    
    get offset (){
        return this.#offset;
    }
}
