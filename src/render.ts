import {tileNumberByXYPos,getAABB} from './collision';
import {initState, spacing, state, moveCamera} from './state';

export const canvas =  <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var can = false
const img_map = new Image();
img_map.onload = () => { can = true }
img_map.src = "/map.png";
const img_pla = new Image();
img_pla.onload = () => { can = true }
img_pla.src = "/anto_anime.png";

 const tiles: any = {"x": '#000000', "`":"#273e63", "\n":"#273e63"};
     const tileMap:any = { 
         'c': [ 0, 0, 20, 20 ],
          'w': [ 20, 0, 20, 20 ],
          'd': [ 40, 0, 20, 20 ],
          'f': [ 0, 20, 20, 20 ],
          'l': [ 20, 20, 20, 20 ],
          's': [ 40, 20, 20, 20 ],
          'p': [ 0, 40, 20, 20 ],
          'r': [ 20, 40, 20, 20 ],
          't': [ 40, 40, 20, 20 ] };


const pyerTiles:any = { 'idle_left.png': [ 1, 1, 20, 20 ],
  'idle_right.png': [ 23, 1, 20, 20 ],
  'jump_1_left.png': [ 45, 1, 20, 20 ],
  'jump_1_right.png': [ 67, 1, 20, 20 ],
  'jump_2_left.png': [ 89, 1, 20, 20 ],
  'jump_2_right.png': [ 111, 1, 20, 20 ],
  'walking_1_left.png': [ 133, 1, 20, 20 ],
  'walking_1_right.png': [ 155, 1, 20, 20 ],
  'walking_2_left.png': [ 177, 1, 20, 20 ],
  'walking_2_right.png': [ 199, 1, 20, 20 ] };

export function render(st: state, map:string,tsize: number, wsize: number){
    if(!can) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
     const [[x,y,w,h,,], [ [px,py,pw,ph,pvx,pvy,dir,onfl]]] = st,
     startCol = Math.floor(x / tsize),
     endCol = startCol + (w / tsize),
     startRow = Math.floor(y / tsize),
     endRow = startRow + (h / tsize),
     offsetX = -x + startCol * tsize,
     offsetY = -y + startRow * tsize;

     const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = getAABB(px+pvx,py+pvy,pw,ph);
     const collides =  [tileNumberByXYPos(ltX,ltY,tsize,wsize),
    tileNumberByXYPos(rtX,rtY,tsize,wsize),
    tileNumberByXYPos(rbX,rbY,tsize,wsize),
    tileNumberByXYPos(lbX,lbY,tsize,wsize)]
    
    for (var c = startCol; c <= endCol; c++) {
        for (var r = startRow; r <= endRow; r++) {
            var targetX = (c - startCol) * tsize + offsetX;
            var targetY = (r - startRow) * tsize + offsetY;
            const letter = map.charAt(r*wsize+c);
            if(letter != '`' && letter != 'x'){
                const [_x,_y,_w,_h] = tileMap[letter];
                ctx.drawImage(
                    img_map, // image
                    _x, // source x
                    _y, // source y
                    _w, // source width
                    _h, // source height
                    Math.round(targetX),  // target x
                    Math.round(targetY), // target y
                    tsize, // target width
                    tsize // target height
                );
            }
            if(collides.indexOf(r*wsize+c) > -1){
                ctx.strokeStyle = 'red';
                ctx.strokeRect(targetX,targetY,tsize,tsize);
            }


        }
    }
    var coords;
    const i = Math.floor(1+(performance.now()* (0.02/5))%2);
    if(onfl){
        if(pvx == 0 ){
          coords = pyerTiles[`idle_${dir}.png`];
        }else{
          coords = pyerTiles[`walking_${i}_${dir}.png`];
        }
      }else{
        coords = pyerTiles[`jump_${i}_${dir}.png`];
    }
    const [_xp,_yp,_wp,_hp] = coords;
    ctx.drawImage(
                    img_pla, // image
                    _xp, // source x
                    _yp, // source y
                    _wp, // source width
                    _hp, // source height
                    Math.round(px-x),  // target x
                    Math.round(py-y), // target y
                    pw, // target width
                    ph // target height
                );
};
