/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const { writeUInt8 , writeUInt16LE , writeUInt32LE } = Buffer.prototype;

const writeMethods = {
  4: writeUInt32LE,
  2: writeUInt16LE,
  1: writeUInt8
}


/*
    ByteBuffer Class
*/

module.exports = class {

  #buffer;
  #offset = 0;


  constructor(size){
    this.#buffer = Buffer.alloc(size);
  }


  /*
      Write Value
  */

  writeValue(value,format = 0){

    const method = writeMethods[format];

    if(method){
      method.call(this.#buffer,value,this.#offset);
      this.#offset += format;
    }

    return this;
  }


  /*
      Write
  */

  write(value,format){
    return this.writeValue(value,format); }


  /*
      Byte
  */

  writeByte(byte){
    return this.writeValue(byte,1); }


  /*
      Word
  */

  writeWord(word){
    return this.writeValue(word,2); }


  /*
      DWord
  */

  writeDWord(dword){
    return this.writeValue(dword,4); }


  /*
      Buffer Data
  */

  get data(){
    return this.#buffer; }
}
