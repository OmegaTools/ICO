
const { min , abs , ceil , floor } = Math;


/*
 *  Alan W. Paeth Filter
 */

function paeth(...args){
    
    const
        [ A , B , C ] = args ,
        p = A + B - C ;
    
    const deltas = args
        .map((x) => abs(p - x));

    const 
        minimum = deltas.reduce((a,b) => min(a,b)) ,
        index = deltas.indexOf(minimum) ;

    return args[ index ];
}



/*
 *  Filter
 */

export default function filter(png){

    let { bpp , data , depth , width , height , passes , interlace } = png;

    const buffers = [];

    let
        bytesPerPixel = 1 ,
        previous = [] ,
        current ,
        offset = 0 ;
    
    if(depth % 8 === 0)
        bytesPerPixel = (depth / 8) * bpp;

    let
        upleft = (x) => previous[x - bytesPerPixel] ?? 0 ,
        left = (x) => current[x - bytesPerPixel] ?? 0 ,
        up = (x) => previous[x] ?? 0 ;

    const filters = [
        null , left , up ,
        (x) => floor((up(x) + left(x)) * .5),
        (x) => paeth(left(x),up(x),upleft(x))
    ]


    for(const pass of passes)
        applyFilter(pass);


    png.data = new Uint8Array(buffers.map((b) => [ ...b]).flat());



    /*
     *  Apply Filter
     */

    function applyFilter({ width , height }){

        previous = [];

        const size = bytesPerLine(width);
        
        // + Filter Byte
        const bytes = size + 1;

        if(bytes > data.length)
            throw `Not enough data (Expected: ${ bytes }|Data: ${ data.length })`;


        for(let line = 0;line < height;line++){

            const [ filterType , ...source ] = data
                .slice(offset,offset += bytes);

            (filterType === 0)
                ? (current = Uint8Array.from(source))
                : filter(filters[filterType]);

            buffers.push(current);
            previous = current;


            /*
             * Filter
             */

            function filter(filter){
                
                current = new Uint8Array(size);

                for(let x = 0;x < size;x++)
                    current[x] = source[x] + filter(x);
            }
        }
    }



    /*
     *  Width In Bytes
     */

    function bytesPerLine(width){
        return ceil(width * bpp * depth * .125);
    }
}
