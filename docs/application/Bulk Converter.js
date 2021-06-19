/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


//  Image Input Directory

const inputDir = `Input`;

//  Icon Output Directory
//  ! BE CAREFUL WITH THIS !
//  As the files in this directory are deleted

const outputDir = `Output`;

//  Generated Sizes In Icon

const sizes = [ 16 , 32 , 48 , 64 , 72 , 96 , 128 , 144 , 188 , 256 ];



const
  path = require('path'),
  fileSystem = require('fs').promises,
  toIcon = require('to-icon'),
  resize = require('resize-image-buffer');


(async () => {
  const oldFiles = await fileSystem.readdir(outputDir) || [];


  /*
      Remove Old Files
  */

  await Promise.all(
    oldFiles
    .filter((name) => /\..+$/.test(name))
    .map((name) => path.join(outputDir,name))
    .map((path) => fileSystem.unlink(path))
  );


  /*
      Find Raw
  */

  const newFiles = await fileSystem.readdir(inputDir) || [];


  for(const file of newFiles){

    console.log(`Converting ${ file }`);

    //  File -> Buffer

    const buffer = await fileSystem.readFile(path.join(inputDir,file));

    //  Buffer -> Resized Buffers

    const buffers = await Promise.all(sizes
      .map((size) => ({ width: size , height: size }))
      .map((args) => resize(buffer,args))
    );

    //  Buffers -> Icon Buffer

    const icon = await toIcon(buffers);

    //  Input Path -> Output Path

    const outputPath = path.join(outputDir,file.replace(/\..+/,'.ico'));

    //  Icon Buffer -> File

    await fileSystem.writeFile(outputPath,icon);
  }
})();
