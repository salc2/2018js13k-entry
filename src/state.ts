import {gtn,gab,collide} from './collision';

type OnFloor = boolean
type Dir = "r" | "l"
export type Kind = "player" | "vending" | "drone" | "desk" | "door" | "key" | "server" | "hammer" | "step";
// x,y,w,h,vx,vz,target
type Id = number;
type Active = number;
type Map = string;
export type Spacing = [number,number,number,number,number,number];
export type Camera = [number,number,number,number,number,number,number];
export type Body = [number,number,number,number,number,number,Dir,OnFloor, Kind,Id, number, Active];
export type Parameter = [number,number,number];
export type ArtifactoryType = "hammer" | "key";
export type Artifactory = [number, ArtifactoryType];
export type Cells = Body[][];
export type Inventory = Artifactory[];
export type Time = number;
export type Message = string;
export type State = [Camera, Body[], Cells, Parameter, Map, Inventory,Time, Message];

const camera:Camera = [0,0,180,100,0,0,0];
const player:Body = [30,60,8,20,0,0.058,'r',true, "player", 0, 0,100];
const enemy2:Body = [830,45,19,21,0.03,0.058,'r',true, "vending",104, 180,0];
const enemy2O:Body = [830,45,19,21,0.03,0.058,'r',true, "drone",105, 180,0];
const enemy3:Body = [697,45,19,21,0.03,0.058,'r',true, "vending",106, 180,0];
const enemy3d:Body = [573,70,19,21,0.03,0.058,'r',true, "drone",108, 180,0];

const harmer:Body = [657,60,10,10,0,0,'r',true, "hammer",33, 0,0];
const key1:Body = [106,2,10,10,0,0,'r',true, "key",99, 0,0];
const door1:Body = [242,39,20,40,0,0,'r',true, "door",63, 67,99];
const door2:Body = [680,39,20,40,0,0,'r',true, "door",67, 63,-1];

const server2:Body = [777,80,18,20,0,0,'r',true, "server",12, 1,100];
const server3:Body = [830,80,18,20,0,0,'r',true, "server",13, 1,100];
const server4:Body = [597,80,18,20,0,0,'r',true, "server",14, 1,100];

function decodeMap(encodeMap:string): string{
    var grps = encodeMap.split(",");
    var result = ""
    grps.forEach( gp => {
        var [n,l] = gp.split("-")
        var i = parseInt(n)
        while(i--){
            result = result + l;
        }
    });
    return result;
}

const map = decodeMap("1-x,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,1-t,1-x,1-f,1-x,1-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,2-t,1-l,3-t,2-x,4-`,1-0,3-_,1-0,3-_,1-0,3-_,1-0,5-`,1-x,1-f,1-x,3-`,1-0,3-_,1-0,3-_,1-0,3-_,1-0,7-`,2-x,2-`,1-w,4-`,1-s,5-`,1-w,4-`,1-0,2-_,1-0,1-x,1-f,1-x,2-`,1-s,4-`,1-w,6-`,1-s,4-`,1-w,3-`,2-x,1-r,1-p,1-c,1-s,3-r,1-s,1-c,1-p,6-r,1-d,2-r,1-c,1-p,1-r,1-x,1-f,1-x,1-r,1-c,1-s,8-r,1-c,1-p,1-c,1-s,3-r,1-s,2-c,2-r,2-x,3-d,7-f,3-d,2-f,3-d,4-f,1-x,1-f,1-x,7-f,3-d,13-f,52-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,24-`,2-x,23-`,1-x,25-`,1-x,23-`,1-x,25-`,1-x,23-`,1-x,1725-`");

// gravity, walkvel, jumpvel
const parameter:Parameter = [0.058,.075,-0.35];

// export const initState: State = [camera,[door1,door2,enemy4,enemy ,desk1, server1, key1, pen1, player],[], parameter, map, [],performance.now()+29000,""];

export const initState: State = [camera,[harmer,key1,door1,door2,server2,server3,server4, enemy2, enemy2O, enemy3,player],[], parameter, map, [],performance.now()+8000,""];

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
    const [c, chars,,pmr,map,inv,tt,msg] = s;
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
    return [c, chars,tiles,pmr,map,inv,tt,msg];
}

export function openUse(m:State): State {
  let [cam, characters,cells,pmtr,map,inv,tt,msg]:State = insertInCells(m,new Array(100),20,10);
  let xToGo:number ,yToGo: number, serverOn, currentDev:Body;
  const player:Body = characters.filter(c => c[8]=="player")[0];
  const [px,py,pw,ph] = player;
gab(px,py,pw,ph).map(xy => gtn(xy[0],xy[1],20,10)).map(tn => cells[tn]).forEach(objects =>{
  if(objects){
    objects.filter(obj => {
      const [ox,oy,ow,oh] = obj;
      const [px,py,pw,ph] = player;
      return collide([px,py,pw,ph],[ox,oy,ow,oh]);
    }).forEach(obj =>{
        if(obj[8] == "door"){
           const parId = obj[10];
           const dest = characters.filter( oth => oth[9] == parId)[0];
           const idKey = obj[11];
           if(idKey > 0){
             for(var i = 0;i<inv.length;i++){
               if(inv[i][1]=="key" && inv[i][0]==idKey){
                 xToGo = dest[0];
                 yToGo = dest[1];
               }
             }
           }else{
              xToGo = dest[0];
              yToGo = dest[1];
           }
        }else if(obj[8] == "server"){
               const pendId = obj[11];
            if(inv.filter(el => el[1] == "hammer")
             .map(elm => elm[0]).indexOf(pendId) > -1){
              obj[10] = 0;
             }
        }
    });
  }
});

if(xToGo && yToGo){
   cam[0] = xToGo-70;
   cam[1] = yToGo-70;
   player[0] = xToGo;
   player[1] = yToGo+10;
   const ns: State = [cam, characters,[],pmtr,map,inv,tt,msg]; 
  return ns;
}else{
  
  m[6] = m[6] - m[6];
  return m;
}
}
