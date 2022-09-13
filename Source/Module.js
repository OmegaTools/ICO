/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const
  Icon = require('./Icon.js'),
  bufferToPNG = require('./png/Parse.js');



/*
    Buffers -> ICO Buffer
*/

module.exports = async (buffers) => {

  if(!buffers)
    return null;

  if(!Array.isArray(buffers))
    buffers = [ buffers ];

  if(buffers.length < 1)
    return null;


  const
    icon = new Icon,
    processes = buffers.map(bufferToPNG),
    images = await Promise.all(processes);


  /*
      Header
  */

  icon.addHeader(images.length);


  /*
      Dictionaries
  */

  for(const image of images)
    icon.addDictionary(image);


  /*
      Content
  */

  for(const image of images){
    icon.addBitmapHeader(image);
    icon.addBitmapData(image);
  }


  return icon.export();
}
