import {gtn,gab,collide} from './collision';

type OnFloor = boolean
type Dir = "r" | "l"
type Kind = "player" | "vending" | "drone" | "furniture" | "door" | "key" | "server" | "pendrive";
// x,y,w,h,vx,vz,target
type Id = number;
type Active = number;
type Map = string;
export type Spacing = [number,number,number,number,number,number];
export type Camera = [number,number,number,number,number,number,number];
export type Body = [number,number,number,number,number,number,Dir,OnFloor, Kind,Id, number, Active];
export type Parameter = [number,number,number];
export type ArtifactoryType = "pendrive" | "key";
export type Artifactory = [number, ArtifactoryType];
export type Cells = Body[][];
export type Inventory = Artifactory[];
export type State = [Camera, Body[], Cells, Parameter, Map, Inventory];

const camera:Camera = [0,0,180,100,0,0,0];
const player:Body = [80,45,8,20,0,0.058,'r',true, "player", 0, 0,0];
const enemy:Body = [200,45,19,21,0.03,0.058,'r',true, "vending",1, 180,0];
const enemy2:Body = [250,45,19,21,0.03,0.058,'r',true, "vending",3, 180,0];
const enemy3:Body = [300,45,19,21,0.03,0.058,'r',true, "vending",4, 180,0];
const enemy4:Body = [350,45,19,21,0.03,0.058,'r',true, "vending",5, 180,0];
//const enemy2:Body = [300,45,19,21,0.03,0.058,'r',true, "drone",2, 300,0];
const desk1:Body = [15,45,20,10,0,0,'r',true, "furniture",3, 0,0];

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

const map = decodeMap("2-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,1-l,3-t,8-`,1-w,11-`,1-w,8-`,1-w,12-`,1-w,13-`,1-s,2-`,1-s,4-`,1-s,6-`,1-s,1-`,1-s,8-`,1-s,2-`,1-s,1-`,1-s,6-`,1-s,5-`,1-r,1-c,2-r,1-p,1-r,1-s,2-r,1-s,1-p,1-c,2-r,1-s,1-c,2-r,1-p,2-r,1-s,1-r,1-s,1-r,1-p,2-r,1-p,3-r,1-s,2-r,1-s,1-r,1-s,1-c,2-r,1-p,1-r,1-c,1-s,5-r,50-f,50-x,2200-`");

// gravity, walkvel, jumpvel
const parameter:Parameter = [0.058,.075,-0.35];

export const initState: State = [camera,[desk1,player,enemy,enemy2,enemy3,enemy4],[], parameter, map, []];

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
    const [c, chars,,pmr,map,inv] = s;
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
    return [c, chars,tiles,pmr,map,inv];
}

export function openUse(m:State): State {
  let [cam, characters,cells,pmtr,map,inv]:State = insertInCells(m,new Array(100),20,10);
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
           const idKey = dest[11];
           if(idKey > 0){
             if(inv.filter(el => el[1] == "key")
             .map(elm => elm[0] == idKey).indexOf(true,idKey) > -1){
               xToGo = dest[0];
               yToGo = dest[1];
             }
           }else{
              xToGo = dest[0];
             yToGo = dest[1];
           }
        }else if(obj[8] == "server"){
               const pendId = obj[11];
            if(inv.filter(el => el[1] == "pendrive")
             .map(elm => elm[0]).indexOf(pendId) > -1){
              obj[10] = 0;
             }
        }
    });
  }
});

if(xToGo && yToGo){
   cam[0] = xToGo;
   cam[1] = yToGo;
   player[0] = xToGo;
   player[1] = yToGo;
   const ns: State = [cam, characters,[],pmtr,map,inv]; 
  return ns;
}else{
  return m;
}
}
