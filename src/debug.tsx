import * as React from "react";
import * as ReactDOM from "react-dom";
import {Update} from './game.runner';
import {Time, Action as GameAction} from './actions';
import {update , initStateCmd,render,subs, Model as GameModel} from './index';
import {Cmd, emptyCmd} from './cmd';
import {initState, Spacing, State, moveCamera, 
    Character,Camera as CameraType} from './state';
    import {canvas} from './render.webgl';


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

    const [cam, players, cells ,[gra, walk, jum]]:Model = props.st;
    const [px,py,pw,ph,pVx,pVy,dir,onflo,k] = players.filter( p => p[8] == "player")[0];
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
    Walk Speed:[{walk}] <input type="text" onChange={e => props.onChange( {kind:"parameter", val:[gra,parseFloat(e.target.value) ,jum] } )}/>
    <br/>
    Jump Speed:[{jum}] <input type="text" onChange={e => props.onChange( {kind:"parameter", val:[gra,jum,parseFloat(e.target.value)] } )}/>
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


export const renderDebug = (onEvent:(a:Action) => void) => (m: Model) => {
    render(onEvent)(m)
    ReactDOM.render(
    <Camera st = {m}  onChange = {onEvent}/>,
    document.getElementById("container")
);
}

export const updateDebug:Update<Action,Model> = (a: Action, m: Model) =>{
      const [cam, players,cells,pmt] = m;

switch (a.kind) {
    case "parameter":
    return [[cam, players, cells, a.val],emptyCmd<Action>()];
    case "cameraPos": 
    const moved:CameraType = moveCamera(cam,a.val[0],a.val[1],1000,1000);
    return [[moved, players, cells, pmt] ,emptyCmd<Action>()];
    case "playerVal": 
    const [xx,yy,ww,hh] = a.val;
    return [[cam, players.map( p =>{
        if(p[8] == "player"){
            const [p_x,p_y,p_w,p_h,p_vx,p_vy,dir,onf,k,tg]:Character = p;
            const p_p:Character = [xx,yy,ww,hh,p_vx,p_vy,dir,onf,k,tg]
            return p_p;
        }else{
            return p;
        }
    }), cells, pmt],emptyCmd<Action>()];
    default:
      return update(a,m);
  }
}




