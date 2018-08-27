import {tileNumberByXYPos,getAABB} from './collision';
import {initState, Spacing, State, moveCamera} from './State';
import {drawImage, gl,getImg} from './render.webgl'

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

  const enemySprite = { 'vending_offline.png': [ 1, 1, 20, 13 ],
  'vending_walking_1_left.png': [ 1, 16, 19, 21 ],
  'vending_walking_1_right.png': [ 1, 39, 19, 21 ],
  'vending_walking_2_left.png': [ 1, 62, 19, 21 ],
  'vending_walking_2_right.png': [ 1, 85, 19, 21 ] };

  const droneEnemy = { 'drone_1_left.png': [ 1, 1, 20, 20 ],
  'drone_1_right.png': [ 23, 1, 20, 20 ],
  'drone_2_left.png': [ 45, 1, 20, 20 ],
  'drone_2_right.png': [ 67, 1, 20, 20 ],
  'drone_3_left.png': [ 89, 1, 20, 20 ],
  'drone_3_right.png': [ 111, 1, 20, 20 ] };

  const sensorSprite = { 'sensor_offline.png': [ 1, 1, 16, 10 ],
  'sensor_online.png': [ 19, 1, 16, 10 ] };

  export function render(st: State, map:string,tsize: number, wsize: number){
    gl.canvas.style.width = `${window.innerWidth}px`;
    gl.canvas.style.height = `${window.innerHeight}px`;
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
                         pw, // target width
                         ph // target height
                     );
      }else if(k == "vending"){
         var coords;
         if(onfl){
             if(charact[10] && charact[10] == 0 ){
               //
               coords = enemySprite[`vending_offline.png`];
             }else{
               coords = enemySprite[`vending_walking_${i}_${dir}.png`];
             }
           }else{
             coords = enemySprite[`vending_walking_2_${dir}.png`];
         }
         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(enemy_text.texture, // image
                         enemy_text.width,
                         enemy_text.height,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         pw, // target width
                         ph // target height
                     );
                [_xp,_yp,_wp,_hp] = sensorSprite['sensor_online.png'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = sensorSprite[`sensor_offline.png`];
                   }
                  drawImage(sensor_text.texture, // image
                         sensor_text.width,
                         sensor_text.height,
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
         coords = droneEnemy[`drone_${q}_${dir}.png`];

         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(drone_text.texture, // image
                         drone_text.width,
                         drone_text.height,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         _wp, // target width
                         _hp // target height
                     );
                [_xp,_yp,_wp,_hp] = sensorSprite['sensor_online.png'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = sensorSprite[`sensor_offline.png`];
                   }
                  drawImage(sensor_text.texture, // image
                         sensor_text.width,
                         sensor_text.height,
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
  };
