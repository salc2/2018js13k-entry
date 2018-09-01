import {initState, Spacing, State, moveCamera, Character} from './state';

//getTileNumer
export function gtn(x: number, y:number, tileSize: number, worldSize: number){
    return Math.floor(y/tileSize) * worldSize + Math.floor(x/tileSize);
}

// clockwise from left-top, right-top, right-buttom,left-buttom
export function gab(x: number, y:number,w:number,h:number): number[][]{
    return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
}

function notSolid(s: string){
    return s != "x";
}

export function moveBody(
    body: Character,
    x:number,
    y:number,
    map: string, 
    tileSize: number, 
    worldSize: number): Character{
    const range_guard = 100;
    const [bX,bY,bW,bH,bVx,bVy,dir,onflor,kind,trg] = body;
    const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = gab(Math.floor(x),Math.floor(y),bW,bH);
    const tRb = gtn(rbX,rbY,tileSize,worldSize);
    const tLb = gtn(lbX,lbY,tileSize,worldSize);
    const tRt = gtn(rtX,rtY,tileSize,worldSize);
    const tLt = gtn(ltX,ltY,tileSize,worldSize);
    var nY = bY, nX = bX, onf = true, ntarget = trg, ndir = dir, nVx = bVx;
    
    if(x > bX){
        const tRb = gtn(rbX,rbY-5,tileSize,worldSize);
        if(notSolid(map.charAt(tRt)) && notSolid(map.charAt(tRb))){
            nX = x;
        }
    } else if(x < bX){
        const tLb = gtn(lbX,lbY-5,tileSize,worldSize);
        if(notSolid(map.charAt(tLt)) && notSolid(map.charAt(tLb))){
            nX = x;
        }
    }
    if(y > bY && notSolid(map.charAt(tLb)) && notSolid(map.charAt(tRb))){
        onf = false;
        nY = y;
    } else if(y < bY && notSolid(map.charAt(tLt)) && notSolid(map.charAt(tRt))){
        onf = false;
        nY = y;
    }
    if(kind == "vending" || kind == "drone"){
        if(dir == "r"){
            if(nX >= trg){
            ntarget = nX - range_guard
            ndir = "l"
            nVx = bVx * -1
            }
        }else{
            if(nX <= trg){
            ntarget = nX + range_guard
            ndir = "r"
            nVx = bVx * -1;
        } 
        }
    }
    
    return [nX,nY,bW,bH,nVx,bVy,ndir,onf,kind,ntarget];
}

export function collide(body1:[number,number,number,number],body2:[number,number,number,number]):boolean {
  return body1[0] < body2[0] + body2[2] && 
    body1[0] + body1[2] > body2[0] &&
    body1[1] < body2[1] + body2[3] && 
    body1[1] + body1[3] > body2[1];
}
