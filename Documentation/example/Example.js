const
  fileSystem = require('fs'),
  toIcon = require('to-icon');


const paths = [ '30x30.png' , '50x50.png' ];


const buffers = paths
  .map((path) => fileSystem.readFileSync(path));


toIcon(buffers).then((icon) => {
	fileSystem.writeFileSync('Icon.ico',icon);
});
