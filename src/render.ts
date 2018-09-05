import {gtn,gab} from './collision';
import {initState, Spacing, State, moveCamera} from './State';
import {drawImage, g, getImg, postTexture, bindFrameBuffer, renderPostProcessing} from './render.webgl'

const map_text = getImg('./map.png');
const char_text = getImg('./charatlas.png');

const tiles: any = {"x": '#000000', "`":"#273e63", "\n":"#273e63"};
const tileMap:any = { 
  'c': [ 0, 0, 20, 20 ],
  'w': [ 20, 0, 20, 20 ],
  'd': [ 40, 10, 20, 10 ],
  'f': [ 0, 20, 20, 20 ],
  'l': [ 20, 20, 20, 20 ],
  's': [ 40, 20, 20, 20 ],
  'p': [ 0, 40, 20, 20 ],
  'r': [ 20, 40, 20, 20 ],
  't': [ 40, 40, 20, 20 ] };

  const charsAtlas = { 
    'd1': [ 0, 0, 20, 20 ],
  'd2': [ 20, 0, 20, 20 ],
  'd3': [ 40, 0, 20, 20 ],
  'pi1': [ 60, 0, 8, 20 ],
  'pi2': [ 68, 0, 8, 20 ],
  'pj1': [ 76, 0, 12, 17 ],
  'pj2': [ 88, 0, 12, 17 ],
  'pw1': [ 100, 0, 8, 20 ],
  'pw2': [ 108, 0, 10, 19 ],
  'sof': [ 118, 0, 16, 10 ],
  'son': [ 134, 0, 16, 10 ],
  'vo': [ 150, 0, 20, 13 ],
  'vw1': [ 170, 0, 19, 21 ],
  'vw2': [ 189, 0, 19, 21 ] };

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
         const b = (Math.round(performance.now()* 0.008) % 10) == 2 ? 2 : 1;
      if(k == "player"){

         var coords;
         if(onfl){
             if(pvx == 0 ){
               coords = charsAtlas[`pi${b}`];
             }else{
               coords = charsAtlas[`pw${i}`];
             }
           }else{
             coords = charsAtlas[`pj${i}`];
         }
         const fx = dir == "l" ? 1.0 : -1.0;
         const [_xp,_yp,_wp,_hp] = coords;
         drawImage(char_text.tex, // image
                         char_text.w,
                         char_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x) + (fx < 0 ? _wp : 0),  // target x
                         Math.round(py-y), // target y
                         _wp*fx, // target width
                         _hp
                     );
      }else if(k == "vending"){
         var coords;
         if(onfl){
             if(charact[10] && charact[10] == 0 ){
               //
               coords = charsAtlas[`vo`];
             }else{
               coords = charsAtlas[`vw${i}`];
             }
           }else{
             coords = charsAtlas[`vw${i}`];
         }
         const fx = dir == "l" ? 1.0 : -1.0;
         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(char_text.tex, // image
                         char_text.w,
                         char_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x) + (fx < 0 ? _wp : 0),  // target x
                         Math.round(py-y), // target y
                         _wp*fx, // target width
                         _hp
                     );
                [_xp,_yp,_wp,_hp] = charsAtlas['son'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = charsAtlas[`sof`];
                   }
                  drawImage(char_text.tex, // image
                         char_text.w,
                         char_text.h,
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
         coords = charsAtlas[`d${q}`];
          const fx = dir == "l" ? 1.0 : -1.0;
         let [_xp,_yp,_wp,_hp] = coords;
         // if(collides.indexOf(r*wsize+c) > -1){
                drawImage(char_text.tex, // image
                         char_text.w,
                         char_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x) + (fx < 0 ? _wp : 0),  // target x
                         Math.round(py-y), // target y
                         _wp*fx, // target width
                         _hp
                     );
                [_xp,_yp,_wp,_hp] = charsAtlas['son'];
                if(Math.floor((performance.now() * 0.008) % 2) == 0){
                  if(charact[10] && charact[10] == 0 ){
                     coords = charsAtlas['sof'];
                   }
                  drawImage(char_text.tex, // image
                         char_text.w,
                         char_text.h,
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
      }else if(k == "furniture"){
         var coords = tileMap['d'];
         let [_xp,_yp,_wp,_hp] = coords;
                drawImage(map_text.tex, // image
                         map_text.w,
                         map_text.h,
                         _xp, // source x
                         _yp, // source y
                        _wp, // source width
                        _hp, // source height
                         Math.round(px-x),  // target x
                         Math.round(py-y), // target y
                         _wp, // target width
                         _hp
                     );
          //}
      }
    })

      }
    }

    renderPostProcessing(performance.now(),postTexture);
    bindFrameBuffer();

  };
