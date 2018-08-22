import {initState, Spacing, State, moveCamera, Character} from './state';

export function tileNumberByXYPos(x: number, y:number, tileSize: number, worldSize: number){
    return Math.floor(y/tileSize) * worldSize + Math.floor(x/tileSize);
}

// clockwise from left-top, right-top, right-buttom,left-buttom
export function getAABB(x: number, y:number,w:number,h:number): number[][]{
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
    const [bX,bY,bW,bH,bVx,bVy,dir,onflor] = body;
    const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = getAABB(Math.floor(x),Math.floor(y),bW,bH);
    const tRb = tileNumberByXYPos(rbX,rbY,tileSize,worldSize);
    const tLb = tileNumberByXYPos(lbX,lbY,tileSize,worldSize);
    const tRt = tileNumberByXYPos(rtX,rtY,tileSize,worldSize);
    const tLt = tileNumberByXYPos(ltX,ltY,tileSize,worldSize);
    var nY = bY, nX = bX, onf = true;
    
    if(x > bX){
        const tRb = tileNumberByXYPos(rbX,rbY-5,tileSize,worldSize);
        if(notSolid(map.charAt(tRt)) && notSolid(map.charAt(tRb))){
            nX = x;
        }
    } else if(x < bX){
        const tLb = tileNumberByXYPos(lbX,lbY-5,tileSize,worldSize);
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
    return [nX,nY,bW,bH,bVx,bVy,dir,onf];
}
