import {gtn,gab} from './collision';
import {initState, Spacing, State, moveCamera} from './State';
import {drawImage, g, getImg, postTexture, bindFrameBuffer, renderPostProcessing} from './render.webgl'

const map_text = getImg('./map.png');
const player_text = getImg('./anto_anime.png');
const enemy_text = getImg('./vending_animation.png');
const sensor_text = getImg('./sensor.png');
const drone_text = getImg('./drone.png');

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

  const pyerTiles:any = { 
  'il': [ 1, 1, 20, 20 ],
  'ir': [ 23, 1, 20, 20 ],
  'j1l': [ 45, 1, 20, 20 ],
  'j1r': [ 67, 1, 20, 20 ],
  'j2l': [ 89, 1, 20, 20 ],
  'j2r': [ 111, 1, 20, 20 ],
  'w1l': [ 133, 1, 20, 20 ],
  'w1r': [ 155, 1, 20, 20 ],
  'w2l': [ 177, 1, 20, 20 ],
  'w2r': [ 199, 1, 20, 20 ] };

  const enemySprite = { 
  'vo': [ 1, 1, 20, 13 ],
  'v1l': [ 1, 16, 19, 21 ],
  'v1r': [ 1, 39, 19, 21 ],
  'v2l': [ 1, 62, 19, 21 ],
  'v2r': [ 1, 85, 19, 21 ] };

  const droneEnemy = { 
    'd1l': [ 1, 1, 20, 20 ],
  'd1r': [ 23, 1, 20, 20 ],
  'd2l': [ 45, 1, 20, 20 ],
  'd2r': [ 67, 1, 20, 20 ],
  'd3l': [ 89, 1, 20, 20 ],
  'd3r': [ 111, 1, 20, 20 ] };

  const sensorSprite = { 
    'sof': [ 1, 1, 16, 10 ],
  'son': [ 19, 1, 16, 10 ] };

  export function render(st: State, map:string,tsize: number, wsize: number){
    g.canvas.style.width = `${window.innerWidth}px`;
    g.canvas.style.height = `${window.innerHeight}px`;
    g.viewport(0, 0, g.canvas.width, g.canvas.height);

    g.clear(g.COLOR_BUFFER_BIT);
    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
    g.enable(g.BLEND);

    const [[x,y,w,h,,], characters,] = st,
    startCol = Math.floor(x / tsize),
    endCol = startCol + (w / tsize),
    startRow = Math.floor(y / tsize),
    endRow = startRow + (h / tsize),
    offsetX = -x + startCol * tsize,
    offsetY = -y + startRow * tsize;
    bindFrameBuffer();

    for (var c = startCol; c <= endCol; c++) {
      for (var r = startRow; r <= endRow; r++) {
        var targetX = (c - startCol) * tsize + offsetX;
        var targetY = (r - startRow) * tsize + offsetY;
        const letter = map.charAt(r*wsize+c);
        if(letter != '`' && letter != 'x'){
          const [_x,_y,_w,_h] = tileMap[letter];
          drawImage(
                    map_text.tex, // image
                    map_text.w,
                    map_text.h,
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
      const [[ltX,ltY],[rtX,rtY],[rbX, rbY],[lbX,lbY]] = gab(px+pvx,py+pvy,pw,ph);
      const collides =  [gtn(ltX,ltY,tsize,wsize),
      gtn(rtX,rtY,tsize,wsize),
      gtn(rbX,rbY,tsize,wsize),
      gtn(lbX,lbY,tsize,wsize)]
         const i = Math.floor(1+(performance.now()* (0.02/5))%2);
      
      if(k == "player"){

         var coords;
         if(onfl){
             if(pvx == 0 ){
               coords = pyerTiles[`i${dir}`];
             }else{
               coords = pyerTiles[`w${i}${dir}`];
             }
           }else{
             coords = pyerTiles[`j${i}${dir}`];
         }
         const [_xp,_yp,_wp,_hp] = coords;
         drawImage(player_text.tex, // image
                         player_text.w,
                         player_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         pw, // target width
                         ph // target height
                     );
      }else if(k == "vending"){
         var coords;
         if(onfl){
             if(charact[10] && charact[10] == 0 ){
               //
               coords = enemySprite[`vo`];
             }else{
               coords = enemySprite[`v${i}${dir}`];
             }
           }else{
             coords = enemySprite[`v${i}${dir}`];
         }
         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(enemy_text.tex, // image
                         enemy_text.w,
                         enemy_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         pw, // target width
                         ph // target height
                     );
                [_xp,_yp,_wp,_hp] = sensorSprite['son'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = sensorSprite[`sof`];
                   }
                  drawImage(sensor_text.tex, // image
                         sensor_text.w,
                         sensor_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y-_hp), // target y
                         _wp, // target width
                         _hp // target height
                     );
                }
                

          //}
      }else if(k == "drone"){
        const q = Math.round((performance.now()* 0.001)/ 0.04) % 3 + (1);
         var coords;
         coords = droneEnemy[`d${q}${dir}`];

         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(drone_text.tex, // image
                         drone_text.w,
                         drone_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         _wp, // target width
                         _hp // target height
                     );
                [_xp,_yp,_wp,_hp] = sensorSprite['son'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = sensorSprite['sof'];
                   }
                  drawImage(sensor_text.tex, // image
                         sensor_text.w,
                         sensor_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(2 + (px-x)),  // target x
                         Math.round(5 + (py-y-_hp)), // target y
                         _wp, // target width
                         _hp // target height
                     );
                }
                

          //}
      }
    })

      }
    }

    renderPostProcessing(performance.now(),postTexture);
    bindFrameBuffer();

  };
