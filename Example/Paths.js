
import { fromFileUrl , dirname , join } 
from 'https://deno.land/std@0.162.0/path/mod.ts'


const sizes = [ '30x30.png' , '50x50.png' ];


const folder = dirname(fromFileUrl(import.meta.url));


export const images = sizes
    .map((filename) => join(folder,filename));


export const icon = 
    join(folder,'Icon.ico');
