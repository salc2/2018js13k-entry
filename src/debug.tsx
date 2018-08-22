import * as React from "react";
import * as ReactDOM from "react-dom";
import {Update} from './game.runner';
import {Time, Action as GameAction} from './actions';
import {update , initStateCmd,render,subs, Model as GameModel} from './index';
import {Cmd, emptyCmd} from './cmd';
import {canvas} from './render';
import {initState, spacing, state, moveCamera, character} from './state';

export interface Parameter {
    kind: "parameter";
    state: Model;
}

type Action =  GameAction | Parameter;
type Model = GameModel;

export interface CameraProps { st: Model; onChange:((a:Action) => void);}

export const Camera = (props: CameraProps) => {

    const [cam, [player], cells ,[gra, walk, jum]]:Model = props.st;
    const [px,py,pw,ph,pVx,pVy,dir,onflo] = player;
    const [cx,cy,cw,ch,cvx,cvy] = cam;

     function onClickCanvas(event: MouseEvent){
        const nx = ( (event.clientX) - canvas.offsetLeft) * .3 + cam[0],
        ny = (event.clientY - canvas.offsetTop) * .3 + cam[1];
        props.onChange({kind:"parameter", state: [cam, [[nx,ny,pw,ph,pVx,pVy,dir,onflo]], cells ,[gra, walk, jum]]})
    }

   return <form>
   <fieldset>
   <legend>Camera:</legend>
   Camera X: {cx}<input type="range" name="Camera X" value={cx} min="0" max="1000" onChange={ e => props.onChange({kind: "parameter", state:[[parseFloat(e.target.value),cy,cw,ch,cvx,cvy], [player], cells,[gra, walk, jum]]})}/>
   <br/>
    Camera Y: {cy}<input type="range" name="Camera Y" value={cy} min="0" max="1000" onChange={ e => props.onChange({kind: "parameter", state:[[cx,parseFloat(e.target.value),cw,ch,cvx,cvy], [player], cells,[gra, walk, jum]]})} />
    </fieldset>
    <fieldset>
    <legend>Player:</legend>
    Change postion:<input type="checkbox" value="false" onClick={e => {
        if(e.currentTarget.checked){
            canvas.addEventListener('click', onClickCanvas, true);
        }else{
            canvas.removeEventListener('click', onClickCanvas, true);
        }
    }}/>
    <br/>
    Gravity Speed:[{gra}] <input type="text" onChange={e => props.onChange( {kind:"parameter", state:[cam, [player], cells,[parseFloat(e.target.value), walk, jum]]} )}/>
    <br/>
    Walk Speed:[{walk}] <input type="text" onChange={e => props.onChange( {kind:"parameter", state:[cam, [player], cells,[gra, parseFloat(e.target.value), jum]]} )}/>
    <br/>
    Jump Speed:[{jum}] <input type="text" onChange={e => props.onChange( {kind:"parameter", state:[cam, [player], cells,[gra, walk, parseFloat(e.target.value)]]} )}/>
    <br/>
    Width:[{pw}] <input type="text" onChange={e => {
        const np:character = [px,py,parseFloat(e.target.value),ph,pVx,pVy,dir,onflo];
        props.onChange( {kind:"parameter", state:[cam, [np], cells,[gra, walk, jum]]} )
    }}/>
    <br/>
    Height:[{ph}] <input type="text" onChange={e => {
        const np:character = [px,py,pw,parseFloat(e.target.value),pVx,pVy,dir,onflo];
        props.onChange( {kind:"parameter", state:[cam, [np], cells,[gra, walk, jum]]} )
    }}/>

    </fieldset>
    </form>;
};


export const renderDebug = (onEvent:(a:Action) => void) => (m: Model) => {
    const [cam, [[px,py,pw,ph,pVx,pVy]], pmtr]:Model = m;
    render(onEvent)(m)
    ReactDOM.render(
    <Camera st = {m}  onChange = {onEvent}/>,
    document.getElementById("container")
);
}

export const updateDebug:Update<Action,Model> = (a: Action, m: Model) =>{
      const [cam, [player],cells,pmt] = m;

switch (a.kind) {
    case "parameter":
    const [cam, [player], cells,pmtr] = a.state;
    const moved:spacing = moveCamera(m[0],cam[0],cam[1],1000,1000);
    return [[moved, [player], cells,pmtr],emptyCmd<Action>()];
    default:
      return update(a,m);
  }
}




