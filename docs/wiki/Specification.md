# Specification


## Header

| **Offset** | **Size** | **Description** |
| :---:  | :---: | :--- |
| 0 | 2 | Reserved |
| 2 | 2 | [ 1 ] .ICO<br>[ 2 ] .CUR |
| 4 | 2 | Image count |


## Image Directory

| **Offset** | **Size** | **Description** |
| :---:  | :---: | :--- |
| 0 | 1 | Width [ 0 - 255 ][ 0 = 256 ] |
| 1 | 1 | Height [ 0 - 255 ][ 0 = 256 ] |
| 2 | 1 | Color Palette [ 0 = None ] |
| 3 | 1 | Reserved |
| 4 | 2 | Color Plane [ 0 / 1 ] |
| 6 | 2 | Bits Per Pixel |
| 8 | 4 | Size in Bytes |
| 12 | 4 | Offset of Image Data |
