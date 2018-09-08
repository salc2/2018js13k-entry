import {gtn,gab} from './collision';
import {initState, Spacing, State, moveCamera} from './State';
import {drawImage, g, getImg, postTexture, bindFrameBuffer, renderPostProcessing} from './render.webgl'

const map_text = getImg('./map.png');
const char_text = getImg('./charatlas.png');

const tileMap: any = { 
  '0': [ 0, 0, 20, 20 ],
  '-': [ 20, 0, 20, 20 ],
  'c': [ 40, 0, 20, 20 ],
  'w': [ 60, 0, 20, 20 ],
  'f': [ 80, 0, 20, 20 ],
  'l': [ 100, 0, 20, 20 ],
  's': [ 120, 0, 20, 20 ],
  'p': [ 140, 0, 20, 20 ],
  'r': [ 160, 0, 20, 20 ],
  't': [ 180, 0, 20, 20 ] }

   const charsAtlas:any = { 
  'd1': [ 40, 40, 20, 20 ],
  'd2': [ 0, 60, 20, 20 ],
  'd3': [ 34, 60, 20, 20 ],
  'desk': [ 0, 10, 18, 10 ],
  'door': [ 20, 60, 14, 20 ],
  'step': [ 0, 0, 20, 10 ],
  'key': [ 34, 10, 10, 10 ],
  'pendrive': [ 36, 0, 10, 10 ],
  'pi1': [ 54, 60, 8, 20 ],
  'pi2': [ 0, 80, 8, 20 ],
  'pj1': [ 20, 20, 12, 17 ],
  'pj2': [ 32, 20, 12, 17 ],
  'pw1': [ 54, 20, 8, 20 ],
  'pw2': [ 44, 20, 10, 19 ],
  'sof': [ 18, 10, 16, 10 ],
  'son': [ 20, 0, 16, 10 ],
  'server': [ 0, 40, 40, 20 ],
  'vo': [ 0, 20, 20, 13 ],
  'vw1': [ 8, 80, 19, 21 ],
  'vw2': [ 27, 80, 19, 21 ] };

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
             if(charact[11] && charact[11] > 0 ){
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
                if(Math.floor((performance.now() * 0.008) % 2) == 0){

                  if(charact[11] && charact[11] > 0){
                     [_xp,_yp,_wp,_hp] = charsAtlas['sof'];
                   }else{
                     [_xp,_yp,_wp,_hp] = charsAtlas['son'];
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
         if(charact[11] && charact[11] > 0){
           coords = charsAtlas[`d1`];
         }else{
           coords = charsAtlas[`d${q}`];
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
                    if(charact[11] && charact[11] > 0){
                     [_xp,_yp,_wp,_hp] = charsAtlas['sof'];
                   }else{
                     [_xp,_yp,_wp,_hp] = charsAtlas['son'];
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
      }else if(["desk","pendrive","key","server","door","step"].indexOf(k) > -1){
         let [_xp,_yp,_wp,_hp] = charsAtlas[k];
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
      }
    })

      }
    }

    renderPostProcessing(performance.now(),postTexture);
    bindFrameBuffer();

  };
