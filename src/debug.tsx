import * as React from "react";
import * as ReactDOM from "react-dom";
import {Update} from './game.runner';
import {Time, Action as GameAction} from './actions';
import {update , initStateCmd,render,subs, Model as GameModel} from './index';
import {Cmd, emptyCmd} from './cmd';
import {initState, Spacing, State, moveCamera, 
    Body,Camera as CameraType} from './state';
    import {canvas,drawImage, g} from './render.webgl';

import 'fpsmeter';

declare var FPSMeter:any;

const fpsM = new FPSMeter();

export const canvasDebug:any = document.createElement("canvas")
document.body.appendChild(canvasDebug)
canvasDebug.style ="left: -1000";
const div = document.createElement("div")
div.id ="container";
document.body.appendChild(div)
const _2d = canvasDebug.getContext("2d");

export interface PlayerValues {
    kind: "playerVal";
    val: [number,number,number,number];
}

export interface CameraPos {
    kind: "cameraPos";
    val: [number,number];
}

export interface Parameter {
    kind: "parameter";
    val: [number,number,number];
}

type Action =  GameAction | CameraPos | Parameter | PlayerValues;
type Model = GameModel;

export interface CameraProps { st: Model; onChange:((a:Action) => void);}

export const Camera = (props: CameraProps) => {

    const [cam, players, cells ,[gra, walk, jum],map]:Model = props.st;
    const [px,py,pw,ph,pVx,pVy,dir,onflo,k,,] = players.filter( p => p[8] == "player")[0];
    const [cx,cy,cw,ch,cvx,cvy,tgt] = cam;

     function onClickCanvas(event: MouseEvent){
        const nx = ( (event.clientX) - canvas.offsetLeft) * .3 + cam[0],
        ny = (event.clientY - canvas.offsetTop) * .3 + cam[1];
        props.onChange({kind:"playerVal", val: [nx,ny,pw,ph]})
    }

   return <form>
   <fieldset>
   <legend>Camera:</legend>
   Camera X: {cx}<input type="range" name="Camera X" value={cx} min="0" max="1000" onChange={ e => props.onChange({kind: "cameraPos", val:[parseFloat(e.target.value),cy]})}/>
   <br/>
    Camera Y: {cy}<input type="range" name="Camera Y" value={cy} min="0" max="1000" onChange={ e => props.onChange({kind: "cameraPos", val:[cy,parseFloat(e.target.value)]})} />
    </fieldset>
    <fieldset>
    <legend>Player:</legend>
    Change postion:<input type="checkbox" value="false" onClick={e => {
        if(e.currentTarget.checked){
            canvas.addEventListener("click",onClickCanvas, true)
        }else{
            canvas.removeEventListener("click",onClickCanvas, true)
        }
    }}/>
    <br/>
    Gravity Speed:[{gra}] <input type="text" onChange={e => props.onChange( {kind:"parameter", val:[parseFloat(e.target.value), walk, jum] } )}/>
    <br/>
    Walk Speed:[{walk}] <input type="text" onChange={e => props.onChange( {kind:"parameter", val:[gra,parseFloat(e.target.value),jum] } )}/>
    <br/>
    Jump Speed:[{jum}] <input type="text" onChange={e => props.onChange( {kind:"parameter", val:[gra,walk,parseFloat(e.target.value)] } )}/>
    <br/>
    Width:[{pw}] <input type="text" onChange={e => {
        props.onChange( {kind:"playerVal", val:[px,py,parseFloat(e.target.value),ph]} )
    }}/>
    <br/>
    Height:[{ph}] <input type="text" onChange={e => {
        props.onChange( {kind:"playerVal", val:[px,py,pw,parseFloat(e.target.value)]} )
    }}/>

    </fieldset>
    </form>;
};

function returnTextureFromCanvas(canvas){
const tex = g.createTexture();
g.bindTexture(g.TEXTURE_2D, tex);
// Fill the texture with a 1x1 blue pixel.
g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));

// let's assume all images are not a power of 2
g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);

 g.bindTexture(g.TEXTURE_2D, tex);
 g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, canvas);

 return tex;
}


function oldScreent(){
    function roundRect(x0, y0, x1, y1, r, color)
{
    var w = x1 - x0;
    var h = y1 - y0;
    if (r > w/2) r = w/2;
    if (r > h/2) r = h/2;
    _2d.filter = 'blur(5px)';
   
    _2d.beginPath();
    _2d.moveTo(x1 - r, y0);
    _2d.quadraticCurveTo(x1, y0, x1, y0 + r);
    _2d.lineTo(x1, y1-r);
    _2d.quadraticCurveTo(x1, y1, x1 - r, y1);
    _2d.lineTo(x0 + r, y1);
    _2d.quadraticCurveTo(x0, y1, x0, y1 - r);
    _2d.lineTo(x0, y0 + r);
    _2d.quadraticCurveTo(x0, y0, x0 + r, y0);
    _2d.closePath();
    _2d.fillStyle = color;
    _2d.clip();

_2d.fillStyle='rgba(0, 0, 0, 1)';
_2d.fillRect(0,0,180,100);
}


_2d.clearRect(0,0,180,100);
roundRect(0,0,180,100,28,'rgba(255,255,255,1)')
}

export const renderDebug = (onEvent:(a:Action) => void) => (m: Model) => {
    render(onEvent)(m)


   // drawImage(returnTextureFromCanvas(_2d.canvas),180,100,0,0,180,100,0,0,180,100);
    fpsM.tick()
    ReactDOM.render(
    <Camera st = {m}  onChange = {onEvent}/>,
    document.getElementById("container")
);
}

export const updateDebug:Update<Action,Model> = (a: Action, m: Model) =>{
      const [cam, players,cells,pmt,map,inv,tt,msg] = m;

switch (a.kind) {
    case "parameter":
    return [[cam, players, cells, a.val,map,inv,tt,msg],emptyCmd<Action>()];
    case "cameraPos": 
    const moved:CameraType = moveCamera(cam,a.val[0],a.val[1],1000,1000);
    return [[moved, players, cells, pmt,map,inv,tt,msg] ,emptyCmd<Action>()];
    case "playerVal": 
    const [xx,yy,ww,hh] = a.val;
    return [[cam, players.map( p =>{
        if(p[8] == "player"){
            const [p_x,p_y,p_w,p_h,p_vx,p_vy,dir,onf,k,id,tg,act]:Body = p;
            const p_p:Body = [xx,yy,ww,hh,p_vx,p_vy,dir,onf,k,id,tg,act]
            return p_p;
        }else{
            return p;
        }
    }), cells, pmt, map,inv,tt,msg],emptyCmd<Action>()];
    default:
      return update(a,m);
  }
}




