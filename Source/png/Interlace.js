
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
 *  [ xOff , yOff , xGap , yGap ]
 */

const Passes = [
    [ 0 , 0 , 8 , 8 ] ,
    [ 4 , 0 , 8 , 8 ] ,
    [ 0 , 4 , 4 , 8 ] ,
    [ 2 , 0 , 4 , 4 ] ,
    [ 0 , 2 , 2 , 4 ] ,
    [ 1 , 0 , 2 , 2 ] ,
    [ 0 , 1 , 1 , 2 ]
]


const { floor } = Math;


/*
 *  Calculate Pass Points
 */

export function calculatePoints(Width,Height){

    let points = [];

    for(const [ xOffset , yOffset , xGap , yGap ] of Passes)
        for(let y = yOffset;y < Height;y += yGap)
            for(let x = xOffset;x < Width;x += xGap)
                points.push(y * width + x);

    return points.map((offset) => offset * 4);
}



/*
 *  Calculate Pass Sizes
 */

export function calculatePasses(Width,Height){
    
    function calculatePass(pass,index){
        
        const [ xOffset , yOffset , xGap , yGap ] = pass;
        
        let
            height = 0 ,
            width = 0 ;

        for(let y = yOffset;y < Height;y += yGap)
            height++;

        for(let x = xOffset;x < Width;x += xGap)
            width++;

        return { index , width , height };
    }
    
    return Passes.map(calculatePass);
}
