import {gtn,gab} from './collision';

type OnFloor = boolean
type Dir = "r" | "l"
type Kind = "player" | "vending" | "drone" | "furniture";
// x,y,w,h,vx,vz,target
type Id = number;
export type Spacing = [number,number,number,number,number,number];
export type Camera = [number,number,number,number,number,number,number];
export type Player = [number,number,number,number,number,number,Dir,OnFloor, Kind,Id, number];
export type Enemy = [number,number,number,number,number,number,Dir,OnFloor, Kind,Id, number, number];
export type Furniture = [number,number,number,number,number,number,Dir,OnFloor, Kind,Id, number, number];
export type Body = Player | Enemy | Furniture;
export type Parameter = [number,number,number];
export type Cells = Body[][];
export type State = [Camera, Body[], Cells, Parameter];

const camera:Camera = [0,0,180,100,0,0,0];
const player:Player = [80,45,8,20,0,0.058,'r',true, "player", 0, 0];
const enemy:Enemy = [300,45,19,21,0.03,0.058,'r',true, "vending",1, 180,1];
const enemy2:Enemy = [200,45,19,21,0.03,0.058,'r',true, "drone",2, 300,1];
const desk1:Furniture = [85,45,20,10,0,0,'r',true, "furniture",3, 0,0];

// gravity, walkvel, jumpvel
const parameter:Parameter = [0.058,.075,-0.35];

export const initState: State = [camera,[player,enemy,enemy2,desk1],[], parameter];

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
            result.push(map.charAt(gtn(c*tsize,r*tsize,tsize,5)));
        }
    }
    return result;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

export const insertInCells = (s: State,tiles: Body[][],tileSize: number, worldSize: number): State => {
    const [c, chars,,pmr] = s;
    chars.forEach(c => { 
        const aabbs = gab(c[0], c[1],c[2],c[3]);
        const tilesN = aabbs.map( xy =>  gtn(xy[0],xy[1],tileSize,worldSize));
        tilesN.filter(onlyUnique).forEach(tile => {
            if(tiles[tile]){
                tiles[tile].push(c)
            }else{
                tiles[tile] = [c]
            }
        });
    })
    return [c, chars,tiles,pmr];
}
