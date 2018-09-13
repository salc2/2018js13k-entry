import {initState, Spacing, State, moveCamera, Body, Cells} from './state';
import {Cmd, emptyCmd, create} from './cmd';
import {Action} from './actions';
//import {gotInventorySound,soundSplashEnemy} from './sound'

//getTileNumer
export function gtn(x: number, y:number, tileSize: number, worldSize: number){
    return Math.floor(y/tileSize) * worldSize + Math.floor(x/tileSize);
}

// clockwise from left-top, right-top, right-buttom,left-buttom
export function gab(x: number, y:number,w:number,h:number): number[][]{
    return [[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
}

function notSolid(s: string){
    return ["x","d","_","0"].indexOf(s) < 0 ;
}

export function moveBody(
    body: Body,
    x:number,
    y:number,
    map: string, 
    tileSize: number, 
    worldSize: number,
    cells: Cells): [Body, Cmd<Action>]{

    const aver = body[7];
    const range_guard = 100;
    const [bX,bY,bW,bH,bVx,bVy,dir,onflor,kind,id,trg,dead] = body;
    const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = gab(Math.floor(bX),Math.floor(bY),bW,bH);
    const tRb = gtn(rbX,rbY,tileSize,worldSize);
    const tLb = gtn(lbX,lbY,tileSize,worldSize);
    const tRt = gtn(rtX,rtY,tileSize,worldSize);
    const tLt = gtn(ltX,ltY,tileSize,worldSize);
    var nY = bY, nX = bX, onf = true, ntarget = trg, ndir = dir, nVx = bVx, nH = bH, nVy = bVy;
    var cmd:Cmd<Action> = emptyCmd<Action>();

    var canMoveUp:boolean = true,
    canMoveDown:boolean = true,
    canMoveRight:boolean = true,
    canMoveLeft:boolean = true,
    amIdead = dead;
    const isEnemy = (s:string) => s == "vending" || s == "drone";
    const notCollide = (k:string) => !(k == "key" || k == "hammer" || k == "server" || k == "door");

    gab(bX,bY,body[2],body[3]).map(xy => gtn(xy[0],xy[1],tileSize,worldSize)).map(tn => cells[tn]).forEach(bodies =>{
        if(bodies){
            bodies.filter(e => e[9] != id).forEach(e => {
                const [ex,ey,ew,eh] = e;
                const e_kind = e[8];
                const above = (bY+bH-4)<ey, left = (x > bX && ex < bX), right = (x < bX && ex > bX);
                if(collide([bX,bY,body[2],body[3]],[ex,ey,ew,eh])){
                    if(notCollide(e_kind)){
                        canMoveUp = !(y < bY) || above;
                        canMoveDown = !(y > bY) || isEnemy(kind)
                        canMoveRight = !(x > bX) || above || left;
                        canMoveLeft = !(x < bX) || above || right;
                        if(e_kind == "player" && ey+eh-2 < bY && isEnemy(kind)){
                            amIdead = 5000;
                        }else if((e_kind == "player" && isEnemy(kind) && e[10] == 1)){
                            amIdead = 1000;
                        }else if((kind == "player" && isEnemy(e_kind) && body[10] == 1 && e[11] == 0)){
                          //  cmd = soundSplashEnemy();
                        }
                        //
                        if(kind == "player" && isEnemy(e_kind) && ey > bY+bH-2 && e[11] == 0){
                            //cmd = soundSplashEnemy();
                        }
                        if(isEnemy(e_kind) && kind == "player" && e[11] == 0){
                            if(body[10] == 0){
                                   amIdead = amIdead - 1
                            }
                           nX = e[0] > bX ? bX-5 : bX + 5;
                        }

                    }
                    if(e_kind == "player" && (kind == "key" || kind == "hammer") ){
                        nX = -10000;
                    }
                    if(e_kind == "player" && kind == "server" && e[10] == 1 && amIdead > -1){
                        amIdead = amIdead - 1;
                        nY = bY - 0.5;

                    }
                    if(kind == "player" && (e_kind == "key" || e_kind == "hammer") ){
                       // cmd = gotInventorySound();
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
    if(y > bY && !notSolid(map.charAt(tLb)) && !notSolid(map.charAt(tRb)) && !body[7]){

        // if(body[8] == "player"){
        //     cmd = soundOnFloor();
        // }

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
    return [[nX,nY,bW,nH,nVx,nVy,ndir,onf,kind,id,ntarget,amIdead],cmd];
}

export function collide(body1:[number,number,number,number],body2:[number,number,number,number]):boolean {
    return body1[0] < body2[0] + (body2[2]) && 
    body1[0] + (body1[2]) > body2[0] &&
    body1[1] < body2[1] + body2[3] && 
    body1[1] + body1[3] > body2[1];
}
