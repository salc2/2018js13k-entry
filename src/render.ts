import {tileNumberByXYPos,getAABB} from './collision';
import {initState, Spacing, State, moveCamera} from './State';
import {drawImage, gl,getImg} from './render.webgl'

const map_text = getImg('/map.png');
const player_text = getImg('/anto_anime.png');

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



  export function render(st: State, map:string,tsize: number, wsize: number){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    const [[x,y,w,h,,], characters,] = st,
    startCol = Math.floor(x / tsize),
    endCol = startCol + (w / tsize),
    startRow = Math.floor(y / tsize),
    endRow = startRow + (h / tsize),
    offsetX = -x + startCol * tsize,
    offsetY = -y + startRow * tsize;

    for (var c = startCol; c <= endCol; c++) {
      for (var r = startRow; r <= endRow; r++) {
        var targetX = (c - startCol) * tsize + offsetX;
        var targetY = (r - startRow) * tsize + offsetY;
        const letter = map.charAt(r*wsize+c);
        if(letter != '`' && letter != 'x'){
          const [_x,_y,_w,_h] = tileMap[letter];
          drawImage(
                    map_text.texture, // image
                    map_text.width,
                    map_text.height,
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

      characters.forEach(charact =>{
      const [px,py,pw,ph,pvx,pvy,dir,onfl,k,] = charact;
      const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = getAABB(px+pvx,py+pvy,pw,ph);
      const collides =  [tileNumberByXYPos(ltX,ltY,tsize,wsize),
      tileNumberByXYPos(rtX,rtY,tsize,wsize),
      tileNumberByXYPos(rbX,rbY,tsize,wsize),
      tileNumberByXYPos(lbX,lbY,tsize,wsize)]
         const i = Math.floor(1+(performance.now()* (0.02/5))%2);
      
      if(k == "player"){

         var coords;
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
         drawImage(player_text.texture, // image
                         player_text.width,
                         player_text.height,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         tsize, // target width
                         tsize // target height
                     );
      }else{
         var coords;
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
          if(collides.indexOf(r*wsize+c) > -1){
                drawImage(player_text.texture, // image
                         player_text.width,
                         player_text.height,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         tsize, // target width
                         tsize // target height
                     );
          }
      }
    })

      }
    }
  };
