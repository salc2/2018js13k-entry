import {tileNumberByXYPos} from './collision';

type OnFloor = boolean
type Dir = "right" | "left"
// x,y,w,h,vx,vz
export type spacing = [number,number,number,number,number,number];
export type character = [number,number,number,number,number,number,Dir,OnFloor];
export type state = [spacing,character[],[number,number,number]];

const camera:spacing = [0,0,180,100,0,0];
const player:character = [80,45,20,20,0,0.98,'right',true];

// gravity, walkvel, jumpvel
const parameter:[number,number,number] = [.98,.075,-5.5];

export const initState: state = [camera,[player],parameter];

export const moveCamera = (c:spacing,x:number,y:number,ww:number,wh:number) => {
    const [,,w,h,cvx,cvy] = c;
    const [nx,ny] = [x % (ww-w),y % (wh-h)]; 
    const res:spacing = [nx == x ? x : ww-w, ny == y ? y : wh-h,w,h,cvx,cvy];
    return res;
};

export function getTilesFromStringMap(camera: spacing,map:string,tsize: number){
     const [x,y,w,h] = camera,
     startCol = Math.floor(x / tsize),
     endCol = startCol + (w / tsize),
     startRow = Math.floor(y / tsize),
     endRow = startRow + (h / tsize);
     const result: string[] = [];
     for (var c = startCol; c < endCol; c++) {
        for (var r = startRow; r < endRow; r++) {
               result.push(map.charAt(tileNumberByXYPos(c*tsize,r*tsize,tsize,5)));
        }
    }
    return result;
}
