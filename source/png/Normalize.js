/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const { round } = Math;


/*
    Normalize
*/

module.exports = (png) => {

  const { type , depth , transparency } = png;


  if(type === 3) // Is RGB + Palette
    return copyPalette();

  if(transparency)
    scrubTransparency();

  if(depth !== 8) // Is Non-Byte Channel Depth
    scaleDepth();


  function copyPalette(){

    const { data , palette } = png;

    png.data = Buffer.from([...data]
      .map((pixel) => palette[pixel])
      .flat());
  }


  /*
      Scrub Transparancy
  */

  function scrubTransparency(){

    const { size , data , transparency } = png;

    const [ R , G , B ] = transparency;

    const scrubable = (transparency.length === 1)
      ? (offset) => data[offset + 0] === R
      : (offset) => data[offset + 0] === R &&
                    data[offset + 1] === G &&
                    data[offset + 2] === B

    for(let offset = 0;offset < size;offset += 4)
      if(scrubable(offset))
        for(let c = 0;c < 4;c++)
          data[offset + c] = 0;
  }


  /*
      Scale
  */

  function scaleDepth(){

    const { data , size , depth } = png;

    let
      offset = 0,
      buffer = data;

    if(depth === 16)
      buffer = Buffer.alloc(size);

    const
      max = 2 ** depth - 1,
      factor = 255 / max;

    for(let offset = 0;offset < size;offset++)
      buffer[offset] = round(data[offset] * factor);

    png.data = buffer;
  }
}
