/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const { min , abs , ceil , floor } = Math;


/*
    Alan W. Paeth Filter
*/

function paeth(...args){
  const
    [ A , B , C ] = args,
    p = A + B - C,
    deltas = args.map((x) => abs(p - x));

  return args[deltas.indexOf(deltas.reduce((a,b) => min(a,b)))];
}



/*
    Filter
*/

module.exports = (png) => {

  let { bpp , data , depth , width , height , passes , interlace } = png;

  const
    buffers = [];
    bytesPerPixel = (depth % 8 === 0) ? (depth / 8) * bpp : 1;


  let
    current,
    previous = [],
    offset = 0;

  let
    up = (x) => previous[x] || 0,
    left = (x) => current[x - bytesPerPixel] || 0,
    upleft = (x) => previous[x - bytesPerPixel] || 0;

  const filters = [
    null , left , up ,
    (x) => floor((up(x) + left(x)) * .5),
    (x) => paeth(left(x),up(x),upleft(x))
  ];


  for(const pass of passes)
    applyFilter(pass);


  png.data = Buffer.concat(buffers);



  /*
      Apply Filter
  */

  function applyFilter({ width , height }){

    previous = [];

    const
      size = bytesPerLine(width),
      bytes = size + 1; // + 1 (Filter Byte)

    if(bytes > data.length)
      throw `Not enough data (Expected: ${ bytes }|Data: ${ data.length })`;


    for(let line = 0;line < height;line++){

      const [ filterType , ...source ] = data.slice(offset,offset += bytes);

      (filterType === 0)
        ? (current = Uint8Array.from(source))
        : filter(filters[filterType]);

      buffers.push(current);
      previous = current;


      /*
          Filter
      */

      function filter(filter){
        current = Buffer.alloc(size);

        for(let x = 0;x < size;x++)
          current[x] = source[x] + filter(x);
      }
    }
  }



  /*
      Width In Bytes
  */

  function bytesPerLine(width){
    return ceil(width * bpp * depth * .125);
  }
}
