import {tileNumberByXYPos} from './collision';

type OnFloor = boolean
type Dir = "right" | "left"
type Kind = "player" | "enemy"
// x,y,w,h,vx,vz,target
export type Spacing = [number,number,number,number,number,number];
export type Camera = [number,number,number,number,number,number,number];
export type Player = [number,number,number,number,number,number,Dir,OnFloor, Kind, number];
export type Enemy = [number,number,number,number,number,number,Dir,OnFloor, Kind, number];
export type Character = Player | Enemy;
export type Parameter = [number,number,number];
export type Cells = Character[][];
export type State = [Camera, Character[], Cells, Parameter];

const camera:Camera = [0,0,180,100,0,0,0];
const player:Player = [80,45,20,20,0,0.98,'right',true, "player", 0];
const enemy:Enemy = [80,45,20,20,0.03,0.98,'right',true, "enemy", 180];

// gravity, walkvel, jumpvel
const parameter:Parameter = [.98,.075,-5.5];

export const initState: State = [camera,[player,enemy],[], parameter];

export const moveCamera = (c:Camera,x:number,y:number,ww:number,wh:number) => {
            const [,,w,h,cvx,cvy,trg] = c;
    let [nx,ny] = [x % (ww-w),y % (wh-h)]; 
   
    const res:Camera = [nx == x ? x : ww-w, ny == y ? y : wh-h,w,h,cvx,cvy,trg];
    res[0] = res[0] < 0 ? 0 : res[0]
    res[1] = res[1] < 0 ? 0 : res[1]
    return res;

};

export function tilesFromMap(camera: Spacing,map:string,tsize: number){
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
