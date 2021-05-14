# How to Use


### Generalized
```js

  const toIcon = require('to-icon');


  const buffers = [ buffer1 , buffer2 , buffer3 ];


  const icon = await toIcon(buffers);


```


### Example
```js

  const
    fileSystem = require('fs'),
    toIcon = require('to-icon');


  const paths = [ '30x30.png' , '50x50.png' ];


  const buffers = paths
    .map((path) => fileSystem.readFileSync(path));


  const iconBuffer = await toIcon(buffers);


  fileSystem.writeFileSync('Icon.ico',iconBuffer);  

```
