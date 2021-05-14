/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const
  Icon = require('./Icon.js'),
  bufferToImage = require('parse-png');



/*
    Convert Buffers
*/

const convertToIco = async (buffers) => {

  const images = await Promise.all(buffers.map((buffer) => bufferToImage(buffer)));

  const icon = new Icon;


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



/*
    Export
*/

module.exports = convertToIco;
