
# ICO Format

*Offsets & sizes are given in bytes.*

<br>

## Header

| Offset | Size | Description
|:------:|:----:|:------------
| 0 | 2 | ***Reserved***
| 2 | 2 | Image Format
| 4 | 2 | Image Count

<br>

### Image Format

<br>

-   `1`  ➞  `.ico`

-   `2`  ➞  `.cur`

<br>
<br>

## Image Directory

| Offset | Size | Description 
|:------:|:----:|:------------
|  0 | 1 | Image Width
|  1 | 1 | Image Height
|  2 | 1 | Color Palette <br> `0` = None
|  3 | 1 | ***Reserved***
|  4 | 2 | Color Plane <br> Either `0` or `1`
|  6 | 2 | Bits Per Pixel
|  8 | 4 | Size in Bytes
| 12 | 4 | Offset of Image Data

<br>

### Image Size

While the range of one byte covers `0 - 255`, an <br>
exception is made for `0`, which is used for `256px`.

<br>
<br>

<div align = center>

## PNG Structure

[![Chunk]][#]

*Visualization of a **Chunk**.*

</div>

<br>


<!----------------------------------------------------------------------------->

[#]: #

[Chunk]: ../Assets/Chunk.png
