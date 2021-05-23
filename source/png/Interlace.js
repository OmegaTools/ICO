/*
    Copyright (c) 2021 JDK.FHWS@gmail.com
*/


const { floor } = Math;


/*
                                   Adam 7 Algorithm


             1                   2                   3                   4
    +-----------------+ +-----------------+ +-----------------+ +-----------------+
    | #               | | X       #       | | X       X       | | X   #   X   #   |
    |                 | |                 | |                 | |                 |
    |                 | |                 | |                 | |                 |
    |                 | |                 | |                 | |                 |
    |                 | |                 | | #       #       | | X   #   X   #   |
    |                 | |                 | |                 | |                 |
    |                 | |                 | |                 | |                 |
    |                 | |                 | |                 | |                 |
    +-----------------+ +-----------------+ +-----------------+ +-----------------+
             5                             6                             7
    +-----------------+           +-----------------+           +-----------------+
    | X   X   X   X   |           | X # X # X # X # |           | X X X X X X X X |
    |                 |           |                 |           | # # # # # # # # |
    | #   #   #   #   |           | X # X # X # X # |           | X X X X X X X X |
    |                 |           |                 |           | # # # # # # # # |
    | X   X   X   X   |           | X # X # X # X # |           | X X X X X X X X |
    |                 |           |                 |           | # # # # # # # # |
    | #   #   #   #   |           | X # X # X # X # |           | X X X X X X X X |
    |                 |           |                 |           | # # # # # # # # |
    +-----------------+           +-----------------+           +-----------------+

*/


/*
    [ xOff , yOff , xGap , yGap ]
*/

const Passes = [
  [ 0 , 0 , 8 , 8 ],
  [ 4 , 0 , 8 , 8 ],
  [ 0 , 4 , 4 , 8 ],
  [ 2 , 0 , 4 , 4 ],
  [ 0 , 2 , 2 , 4 ],
  [ 1 , 0 , 2 , 2 ],
  [ 0 , 1 , 1 , 2 ]
];


/*
    Calculate Pass Points
*/

exports.calcPoints = (width,height) => {

  let points = [];

  for(const [ xOffset , yOffset , xGap , yGap ] of Passes)
    for(let y = yOffset;y < height;y += yGap)
      for(let x = xOffset;x < width;x += xGap)
        points.push(y * width + x);

  return points.map((offset) => offset * 4);
}



/*
    Calculate Pass Sizes
*/

exports.calculatePasses = (Width,Height) => {
  return Passes.map(([ xOffset , yOffset , xGap , yGap ],index) => {
    let
      width = 0,
      height = 0;

    for(let y = yOffset;y < Height;y += yGap)
      height++;

    for(let x = xOffset;x < Width;x += xGap)
      width++;

    return { index , width , height };
  });
}
