/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const
  zlib = require('zlib'),
  filter = require('./Filter.js'),
  toBitMap = require('./Bitmap.js'),
  normalize = require('./Normalize.js'),
  { calculatePasses } = require('./Interlace.js');;


const { max , floor } = Math;

const
  colorToBPP = { 0 : 1 , 2 : 3 , 3 : 1 , 4 : 2 , 6 : 4 },
  signature = [ 0x89 , 0x50 , 0x4e , 0x47 , 0x0d , 0x0a , 0x1a , 0x0a ];



module.exports = (buffer) => {

  /*
      Signature
  */

  {
    for(let i = 0;i < 8;i++)
      if(signature[i] !== buffer[i])
        throw `Buffer data has non-png signature: [${ buffer }]`;
  }


  const chunks = new Map;
  chunks.set('IDAT',[]);


  /*
      Read Chunks
  */

  {
    let offset = 8;

    while(offset < buffer.length){

      const
        size = buffer.readUInt32BE(offset),
        type = buffer.toString('ascii',offset += 4,offset += 4),
        data = buffer.subarray(offset,offset += size),
        checksum = buffer.subarray(offset,offset += 4);


      if(type === 'IDAT'){
        chunks
        .get('IDAT')
        .push(data);

        continue;
      }

      chunks.set(type,data);
    }
  }


  let png;


  /*
      Properties
  */

  {
    const
      data = chunks.get('IHDR'),
      type = data[9];

    const
      width = data.readUInt32BE(0),
      height = data.readUInt32BE(4);

    png = {

      bpp: colorToBPP[type],

      size: height * width * 4,

      color:       Boolean(type & 0x2),
      transparent: Boolean(type & 0x4),

      depth:       data[8],
      filter:      data[11],
      interlace:   data[12],
      compression: data[10],

      type , width , height
    }
  }


  /*
      Color Palette
  */

  if(chunks.has('PLTE')){

    const
      palette = [],
      data = chunks.get('PLTE');

    for(let d = 0,p = 0;d < data.length / d;d += 3,p++)
      palette[p] = [ data[d] , data[d + 1] , data[d + 2] , 255 ];

    png.palette = palette;
  }


  /*
      Transpancy
  */

  if(chunks.has('tRNS')){

    png.transparent = true;

    const
      { type , palette } = png,
      data = chunks.get('tRNS');

    let offset = 0;

    switch(type){
    case 0: // Grayscale
      png.transparency = [ readByte() ];
      break;
    case 2: // RGB
      png.transparency = [ readByte() , readByte() , readByte() ];
      break;
    case 3: // RGB + Palette
      data.forEach((alpha,index) => palette[3] = alpha);
      break;
    }


    function readWord(){
      data.readUInt16(offset);
      offset += 2;
    }
  }



  /*
      Image Data
  */

  {
    const { width , height , bpp , depth , interlace } = png;

    let data = chunks.get('IDAT');



    /*
        Combine Data Chunks
    */

    data = Buffer.concat(data);



    /*
        Decompress
    */

    let options = {};

    if(!png.interlace)
      options.chunkSize = max(height * (floor((width * bpp * depth + 7) / 8) + 1),zlib.Z_MIN_CHUNK);

    data = interlace ? zlib.inflateSync(data) : zlib.inflateSync(data,options);

    if(!data)
      throw `Inflate wasn't created`;

    if(!data.length)
      throw `Invalid inflate length`;


    png.data = data;
    png.passes = interlace ? calculatePasses(width,height) : [ png ];


    /*
        Process
    */

    filter(png);
    toBitMap(png);
    normalize(png);
  }

  return png;
}
