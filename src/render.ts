import {State, Kind, Body} from './State';
import {drawImage, g, getImg,Img, postTexture, bindFrameBuffer, renderPostProcessing} from './render.webgl'
import {renderUi} from './render.ui'

//import 'fpsmeter';

//declare var FPSMeter:any;

//const fpsM = new FPSMeter();

const map_text = getImg('./map.png');
const char_text = getImg('./charatlas.png');

const tileMap: any ={ '0': [ 0, 0, 20, 20 ],
'_': [ 20, 0, 20, 20 ],
'c': [ 40, 0, 20, 20 ],
'w': [ 60, 0, 20, 20 ],
'd': [ 80, 0, 20, 20 ],
'f': [ 100, 0, 20, 20 ],
'l': [ 120, 0, 20, 20 ],
's': [ 140, 0, 20, 20 ],
'p': [ 160, 0, 20, 20 ],
'r': [ 180, 0, 20, 20 ],
't': [ 200, 0, 20, 20 ] };

const charsAtlas = {
  'd1': [ 0, 47, 20, 20 ],
  'd2': [ 40, 47, 20, 20 ],
  'd3': [ 20, 47, 20, 20 ],
  'desk': [ 36, 0, 18, 10 ],
  'door': [ 38, 87, 20, 40 ],
  'hammer': [ 0, 0, 10, 6 ],
  'key': [ 26, 0, 10, 10 ],
  'ph1': [ 0, 67, 17, 20 ],
  'ph2': [ 17, 67, 17, 20 ],
  'pi1': [ 42, 67, 8, 20 ],
  'pi2': [ 34, 67, 8, 20 ],
  'pj1': [ 36, 10, 12, 17 ],
  'pj2': [ 48, 10, 12, 17 ],
  'pw1': [ 28, 27, 8, 20 ],
  'pw2': [ 0, 27, 10, 19 ],
  'sof': [ 0, 10, 16, 10 ],
  'son': [ 10, 0, 16, 10 ],
  'server': [ 10, 27, 18, 20 ],
  'servero': [ 36, 27, 18, 20 ],
  'vo': [ 16, 10, 20, 13 ],
  'vw1': [ 0, 87, 19, 21 ],
  'vw2': [ 19, 87, 19, 21 ] };


  type Coord = number[];

  const seqTimeI = (t:number) =>  Math.floor(1+(t* (0.02/5))%2);
  const seqTimeB = (t:number) =>  (Math.round(t* 0.008) % 10) == 2 ? 2 : 1;
  const seqTimeQ = (t:number) =>  Math.round((performance.now()* 0.001)/ 0.04) % 3 + (1);
  const seqTimeBlink = (t:number):boolean => Math.floor((t * 0.008) % 2) == 0;

  function playerCoords(vx: number,onfloor:boolean,attck:number,time: number):Coord{
    const i = seqTimeI(time),
    b = seqTimeB(time);
    if(onfloor){
      if(attck == 1){
        return charsAtlas['ph'+i];
      }else if(vx == 0 ){
        return charsAtlas['pi'+b];
      }else{
        return charsAtlas['pw'+i];
      }
    }else{
      return charsAtlas['pj'+i];
    }
  }

  function vendingCoords(life: number,time: number):Coord{
    const i = seqTimeI(time),
    b = (Math.round(time* 0.008) % 10) == 2 ? 2 : 1;
    if(life > 0 ){
      return charsAtlas['vo'];
    }else{
      return charsAtlas['vw'+i];
    }
  }

  function droneCoords(life: number,time: number):Coord{
    const q = seqTimeQ(time);
    charsAtlas['d1'][1] = 47;
    charsAtlas['d1'][3] = 20;
    if(life > 0){
      charsAtlas['d1'][1] = 52;
      charsAtlas['d1'][3] = 15;
      return charsAtlas['d1'];
    }else{
      return charsAtlas['d'+q];
    }
  }

  function stuffCoords(kind: string, life: number):Coord{
    if(kind == "server" && life < 0){
    return charsAtlas['servero'];
    }
    return charsAtlas[kind];
  }

  function getCoords(body: Body, time: number): 
  [Img,Coord]{
    switch (body[8]) {
      case "player":
      return [char_text,playerCoords(body[4],body[7],body[10],time)];
      case "vending":
      return [char_text,vendingCoords(body[11],time)];
      case "drone":
      return [char_text,droneCoords(body[11],time)];
      default:
      return [char_text,stuffCoords(body[8],body[11])];
    }
  }

  function renderCharacter(body: Body, time: number, camX: number, camY: number){
    const [img, [x,y,w,h]] = getCoords(body,time);
    const fx = body[6] == "l" ? 1.0 : -1.0;
    drawImage(img.tex,img.w,img.h,x,y,w,h,
      Math.round(body[0]-camX) + (fx < 0 ? w : 0),
      Math.round(body[1]-camY),w*fx,h);
    renderSignal(body[8],body[11],body[0]-camX,body[1]-camY,time);
  }

  function renderSignal(kind:Kind,life:number ,x:number,y:number, time:number):void{
    if( (kind == "vending" || kind == "drone") && seqTimeBlink(time)){
      const iden = life > 0 ? "sof" : "son",
      [_x,_y,_w,_h] = charsAtlas[iden], [plx,ply] = kind == "drone" ? [2,5] : [0,0];
      drawImage(char_text.tex,char_text.w,char_text.h,_x,_y,_w, _h,
        Math.round(x+plx), Math.round(y+ply-_h),_w,_h)
    }
  }


  export function render(st: State, map:string,tsize: number, wsize: number){
   // fpsM.tick()
    g.canvas.style.width = window.innerWidth+"px";
    g.canvas.style.height = window.innerHeight+"px";
    g.viewport(0, 0, g.canvas.width, g.canvas.height);

    g.clear(g.COLOR_BUFFER_BIT);
    g.blendFunc(g.SRC_ALPHA, g.ONE_MINUS_SRC_ALPHA);
    g.enable(g.BLEND);

    const [[x,y,w,h,,], chars,] = st,
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
          try{
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
          }catch(e){}
          
        }
        }

        for(var i = 0; i<chars.length; i++){
          if(chars[i][0]+chars[i][2] > x && chars[i][0] < x + w && chars[i][1] > y && chars[i][1] < y+h){
              renderCharacter(chars[i],performance.now(),x,y)
          }
        }

}




renderPostProcessing(performance.now(),postTexture);
renderUi(st);
// drawImage(ui, // image
//                     32,
//                     8,
//                     0, // source x
//                     0, // source y
//                     32, // source width
//                     8, // source height
//                     20,  // target x
//                     20, // target y
//                     32, // target width
//                     8 // target height
//                     );
bindFrameBuffer();

};
