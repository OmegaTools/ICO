/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const { max , abs , floor , ceil } = Math;


/*
    Alan W. Paeth Filter
*/

function paeth(A,B,C){
  const p = A + B - C;

  return [ A , B , C ]
    .map((x) => abs(p - x))          // Distance To P
    .reduce((a,b) => a < b ? a : b); // Closest To P
}



/*
    Filter
*/

module.exports = (png) => {

  let { bpp , data , depth , width , height , passes , interlace } = png;

  const
    buffers = [];
    bitsPerPixel = (depth % 8 === 0) ? (depth / 8) * bpp : 1;


  let
    current,
    previous,
    offset = 0;

  let
    up = (x) => (previous) ? previous[x] : 0,
    left = (x) => (x >= bitsPerPixel) ? current[x - bitsPerPixel] : 0,
    upleft = (x) => (x >= bitsPerPixel && previous) ? previous[x - bitsPerPixel] : 0;

  const filters = [
    left , up ,
    (x) => round(up(x) + left(x)),
    (x) => paeth(up(x),left(x),upleft(x))
  ];


  for(const pass of passes)
    applyFilter(pass);


  png.data = Buffer.concat(buffers);



  /*
      Width In Bytes
  */

  function bytesPerLine(width){
    return ceil(width * bpp * depth * .125);
  }



  /*
      Apply Filter
  */

  function applyFilter(pass){

    previous = null;

    const
      { width , height } = pass,
      size = bytesPerLine(width),
      bytes = size + 1; // + 1 (Filter Byte)

    if(bytes > data.length)
      throw `Not enough data (Expected: ${ bytes }|Data: ${ data.length })`;


    for(let line = 0;line < height;line++){

      const
        raw = data.slice(offset,offset += bytes),
        [ filterType , ...source ] = raw;


      (filterType === 0)
        ? (current = Uint8Array.from(source))
        : filter(filters[filterType - 1]);

      buffers.push(current);
      previous = current;


      function filter(filter){
        current = Buffer.alloc(size);

        for(let x = 0;x < size;x++)
          current[x] = source[x] + filter(x);
      }
    }
  }
}
