import {Sub} from './sub';
import {Cmd, emptyCmd} from './cmd';
import {runGame, Update} from './game.runner';
import {render as renderExt} from './render';
import {initState, spacing, state, moveCamera,character} from './state';
import {renderDebug,updateDebug} from './debug';
import {Time, Action, LeftPressed, LeftReleased, RightPressed, RightReleased} from './actions';
import {moveBody} from './collision';

export type Model = state;

const clockSub = Sub.create('clock', (consumer: Sub.Subscriber<Action>) => {
    let id = 0;
    let startTime = performance.now();
    const keepAnimation = (time:number) => {
      let t = time - startTime;
      consumer({kind: "time",delta:t});
      startTime = time;
      id = requestAnimationFrame(keepAnimation);
    };
    id = requestAnimationFrame(keepAnimation);
    return () => cancelAnimationFrame(id);
  });


const pressKeySub = Sub.create('pressEvents', (consumer: Sub.Subscriber<Action>) => {
    const handler = (e: KeyboardEvent) => {
      switch(e.keyCode){
        case 37: 
          consumer({kind:"leftPressed",delta:16})
          break;
        case 39:
          consumer({kind:"rightPressed",delta:16})
          break;
        case 38:
          consumer({kind:"upPressed",delta:16})
          break;
        default:
        break;
      } 
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  });

const releaseKeySub = Sub.create('pressEvents', (consumer: Sub.Subscriber<Action>) => {
    const handler = (e: KeyboardEvent) => {
      switch(e.keyCode){
        case 37: 
          consumer({kind:"leftReleased",delta:16})
          break;
        case 39:
          consumer({kind:"rightReleased",delta:16})
          break;
        default:
        break;
      } 
    }; 
    window.addEventListener('keyup', handler, true);
    return () => window.removeEventListener('keyup', handler, true);
  });



const map = "ttltttltttltttltttltttltttltttltttltttltttltttlttt````````w```````````w````````w````````````w`````````````s``s````s``````s`s````````s``s`s``````s`````rcrrprsrrspcrrscrrprrsrsrprrprrrsrrsrscrrprcsrrrrrffffffdfffffffffdfffffffdffffffdffffffffffffffffffxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````";

  const applyMotion = (m: Model, delta: number) => {
    const [cam, [[px,py,pw,ph,pVx,pVy,dir,onflo]],pmtr]:Model = m;
    const gravity = pmtr[0];
    const playr:character = moveBody([px,py,pw,ph,pVx,pVy,dir,onflo],(px+pVx*delta),py+pVy,map,20,50);
    const ns: Model = [cam,[[playr[0],playr[1],pw,ph,pVx,Math.min(pVy+gravity,gravity),dir,playr[7]]],pmtr];
    return ns;
  }

  const walkLeft = (m: Model) => {
    const [cam, [[px,py,pw,ph,pVx,pVy,dir,onflo]],pmtr]:Model = m;
    const vplayer = pmtr[1];
    const nm: Model = [cam, [[px,py,pw,ph,-vplayer,pVy,"left",onflo]],pmtr]; 
    return nm;
  }

  const walkRight = (m: Model) => {
    const [cam, [[px,py,pw,ph,pVx,pVy,dir,onflo]],pmtr]:Model = m;
    const vplayer = pmtr[1];
    const nm: Model = [cam, [[px,py,pw,ph,vplayer,pVy,"right",onflo]],pmtr]; 
    return nm;
  }

  const jump = (m: Model) => {
    const [cam, [[px,py,pw,ph,pVx,pVy,dir,onflo]],pmtr]:Model = m;
    const jumpVel = pmtr[2], gravity = pmtr[0];
    if(onflo){
      const nm: Model = [cam, [[px,py,pw,ph,pVx,jumpVel,dir,false]],pmtr]; 
      return nm;
    }else{
      return m;
    }
  } 

  const stop = (m: Model) => {
    const [cam, [[px,py,pw,ph,pVx,pVy,dir,onflo]],prmtr]:Model = m;
    const nm: Model = [cam, [[px,py,pw,ph,0,pVy,dir,onflo]],prmtr]; 
    return nm;
  }

const applyPhysics = (m: Model, delta: number) => applyMotion(m,delta);

export const update: Update<Action,Model> = (a: Action, m: Model) => {
  switch (a.kind) {
    case "time":
      return [ applyPhysics(m,a.delta) ,emptyCmd<Action>()];
    case "upPressed":
      return [ jump(m),emptyCmd<Action>()];
    case "leftPressed":
      return [ walkLeft(m),emptyCmd<Action>()];
    case "rightPressed":
      return [ walkRight(m),emptyCmd<Action>()];
    case "leftReleased":
      return [ stop(m),emptyCmd<Action>()];
    case "rightReleased":
      return [ stop(m),emptyCmd<Action>()];
  }
}

export const render = (onEvent:(a:Action) => void) => (m: Model) => {
    renderExt(m,map,20,50);
}
export const subs = (m: Model) => {
  const zero: Time = {kind:"time", delta: 0}; 
  return [clockSub,pressKeySub, releaseKeySub];
}
export const initStateCmd:[Model,Cmd<Action>] = [initState, emptyCmd()]

runGame( updateDebug, renderDebug,  subs, initStateCmd);  
