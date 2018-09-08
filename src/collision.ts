import {initState, Spacing, State, moveCamera, Body, Cells} from './state';

//getTileNumer
export function gtn(x: number, y:number, tileSize: number, worldSize: number){
    return Math.floor(y/tileSize) * worldSize + Math.floor(x/tileSize);
}

// clockwise from left-top, right-top, right-buttom,left-buttom
export function gab(x: number, y:number,w:number,h:number): number[][]{
    return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
}

function notSolid(s: string){
    return ["x","d","-","0"].indexOf(s) < 0 ;
}

export function moveBody(
    body: Body,
    x:number,
    y:number,
    map: string, 
    tileSize: number, 
    worldSize: number,
    cells: Cells): Body{

    const range_guard = 100;
    const [bX,bY,bW,bH,bVx,bVy,dir,onflor,kind,id,trg,dead] = body;
    const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = gab(Math.floor(bX),Math.floor(bY),bW,bH);
    const tRb = gtn(rbX,rbY,tileSize,worldSize);
    const tLb = gtn(lbX,lbY,tileSize,worldSize);
    const tRt = gtn(rtX,rtY,tileSize,worldSize);
    const tLt = gtn(ltX,ltY,tileSize,worldSize);
    var nY = bY, nX = bX, onf = true, ntarget = trg, ndir = dir, nVx = bVx, nH = bH, nVy = bVy;
    
    var canMoveUp:boolean = true,
    canMoveDown:boolean = true,
    canMoveRight:boolean = true,
    canMoveLeft:boolean = true,
    amIdead = dead;
    const isEnemy = (s:string) => s == "vending" || s == "drone";
    const notCollide = (k:string) => !(k == "key" || k == "pendrive" || k == "server" || k == "door");

    gab(bX,bY,body[2],body[3]).map(xy => gtn(xy[0],xy[1],tileSize,worldSize)).map(tn => cells[tn]).forEach(bodies =>{
        if(bodies){
            bodies.filter(e => e[9] != id).forEach(e => {
                const [ex,ey,ew,eh] = e;
                const e_kind = e[8];
                const above = (bY+bH-4)<ey, left = (x > bX && ex < bX), right = (x < bX && ex > bX);
                if(collide([bX,bY,body[2],body[3]],[ex,ey,ew,eh]) && notCollide(e_kind)){
                    canMoveUp = !(y < bY) || above;
                    canMoveDown = !(y > bY) || ey+eh-4 < bY || (right || left);
                    canMoveRight = !(x > bX) || above || left;
                    canMoveLeft = !(x < bX) || above || right;
                    if(e_kind == "player" && ey+eh-2 < bY){
                        amIdead = 5000;
                    }
                }
            })
        }});
    
    if(x > bX){
        const tRb = gtn(rbX,rbY-5,tileSize,worldSize);
        if(notSolid(map.charAt(tRt)) && notSolid(map.charAt(tRb)) && canMoveRight){
            nX = x;
        }
    } else if(x < bX){
        const tLb = gtn(lbX,lbY-5,tileSize,worldSize);
        if(notSolid(map.charAt(tLt)) && notSolid(map.charAt(tLb)) && canMoveLeft){
            nX = x;
        }
    }
    if(y > bY && notSolid(map.charAt(tLb)) && notSolid(map.charAt(tRb)) && canMoveDown){
        onf = false;
        nY = y;
    } else if(y < bY && notSolid(map.charAt(tLt)) && notSolid(map.charAt(tRt)) && canMoveUp){
        onf = false;
        nY = y;
    }
    if( (kind == "vending" || kind == "drone") && amIdead == 0){
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
    if(amIdead > 0){
        if(kind == "vending"){
        nH = 13;
        }else if(kind == "drone"){
        nH = 15;
        }
        nVx = 0;
    }
    return [nX,nY,bW,nH,nVx,nVy,ndir,onf,kind,id,ntarget,amIdead];
}

export function collide(body1:[number,number,number,number],body2:[number,number,number,number]):boolean {
    return body1[0] < body2[0] + body2[2] && 
    body1[0] + (body1[2]) > body2[0] &&
    body1[1] < body2[1] + body2[3] && 
    body1[1] + body1[3] > body2[1];
}
