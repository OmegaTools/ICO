/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const ByteBuffer = require('./ByteBuffer.js');


/*
    Sizes
*/

const Size = {
  directory: 16,
  header: 6,
  bmp: 40
}


/*
    Icon Class
*/

module.exports = class {

  #buffers = [];
  #length = 0;
  #offset = 0;


  /*
      ICO Header
  */

  addHeader(imageCount){

    this.#offset = Size.header + Size.directory * imageCount;


    this
    .prepareBuffer(Size.header) // 6
    .writeWord(0)               // Reserved
    .writeWord(1)               // ICO / CUR
    .writeWord(imageCount);     // Image Count
  }


  /*
      Image Dictionary
  */

  addDictionary({ width , height , bpp , data }){

    const size = Size.bmp + data.length;


    if(width === 256)
      width = 0;

    if(height === 256)
      height = 0;


    this
    .prepareBuffer(Size.directory) // 16
    .writeByte(width)              // Width
    .writeByte(height)             // Height
    .writeByte(0)                  // Color Palette
    .writeByte(0)                  // Reserved
    .writeWord(1)                  // Color Plane
    .writeWord(bpp * 8)            // Bits Per Pixel
    .writeDWord(size)              // Byte Size
    .writeDWord(this.#offset);     // Image Data Offset


    this.#offset += size;
  }


  /*
      BMP Header
  */

  addBitmapHeader({ width , height , bpp , size , data }){

    this
    .prepareBuffer(40)       // 40
    .writeDWord(40)          // Header Size
    .writeDWord(width)       // Width
    .writeDWord(height)      // Height
    .writeWord(1)            // Planes
    .writeWord(bpp * 8)      // Color Mode
    .writeDWord(0)           // Compression
    .writeDWord(data.length) // Image Size
    .writeDWord(0)           // H-Resolution
    .writeDWord(0)           // V-Resolution
    .writeDWord(0)           // Used Colors
    .writeDWord(0);          // Important Colors
  }


  /*
      BMP Data
  */

  addBitmapData({ width: w , height: h , bpp , data }){

    const pixels = this.prepareBuffer(data.length);

    for(let y = h - 1;y >= 0;y--)
      for(let x = 0;x < w;x++)
        copyPixel((y * w + x) * bpp);



    /*
        Copy Color
    */

    function copyColor(index){
      pixels.writeByte(data.readUInt8(index));
    }


    /*
        Copy Pixel
    */

    function copyPixel(index){

      for(let c = 2;c >= 0;c--)
        copyColor(index + c);

      copyColor(index + 3);
    }
  }


  /*
      Append Buffer
  */

  prepareBuffer(size){

    const
      buffer = new ByteBuffer(size),
      { data } = buffer;

    this.#buffers.push(data);
    this.#length += data.length;

    return buffer;
  }


  /*
      Export
  */

  export(){
    return Buffer.concat(this.#buffers,this.#length);
  }
}
