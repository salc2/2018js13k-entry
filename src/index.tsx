import {Sub} from './sub';
import {Cmd, emptyCmd} from './cmd';
import {runGame, Update} from './game.runner';
import {render as renderExt} from './render';
import {initState, Spacing, State, moveCamera, Character, Enemy} from './state';
//import {renderDebug,updateDebug} from './debug';
import {Time, Action, LeftPressed, LeftReleased, RightPressed, RightReleased} from './actions';
import {moveBody, tileNumberByXYPos, getAABB} from './collision';

export type Model = State;

const tileSize = 20, mapSize = 50;

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

  const cameraMotion = (m:Model, delta: number):Model => {
    const [cam, characters,cells,pmtr]:Model = m;
    if(cam[0] < cam[6]){
      moveCamera(cam,cam[6] * 0.075 * delta * 0.3,cam[1],1000,1000 )
    }else if(cam[0] > cam[6]){
      moveCamera(cam,cam[6] * 0.075 * delta * 0.3,cam[1],1000,1000 )
    }
    return [cam, characters,cells,pmtr];
  }

  const applyMotion = (m: Model, delta: number):Model => {
    const [cam, characters,cells,pmtr]:Model = m;
    const gravity = pmtr[0];
    const n_characters = characters.map(c => {
      const [px,py,pw,ph,pVx,pVy,dir,onflo,kind] = c;
      const playr:Character = moveBody(c,(px+pVx*delta),py+pVy,map,20,50);
      playr[5] = Math.min(pVy+gravity,gravity)  
      return playr;
    });
    return [cam, n_characters,cells,pmtr];
  }

  const walkLeft = (m: Model):Model => {
    const [cam, characters,cells,pmtr]:Model = m;
    const vplayer = pmtr[1];
    const n_characters = characters.map(c =>{
      if(c[8] == 'player'){
              const [px,py,pw,ph,pVx,pVy,dir,onflo, kind] = c;
              const nplayer:Character = [px,py,pw,ph,-vplayer,pVy,"left",onflo, kind, 0];
              return nplayer;
      }else{
        return c;
      }
    })
    const nm: Model = [cam,n_characters,cells,pmtr]; 
    return nm;
  }

  const walkRight = (m: Model):Model => {
    const [cam, characters,cells,pmtr]:Model = m;
    const vplayer = pmtr[1];
    const n_characs = characters.map( c => {
      if(c[8] == 'player'){
        const [px,py,pw,ph,pVx,pVy,dir,onflo, k] = c;
        const n_player: Character = [px,py,pw,ph,vplayer,pVy,"right",onflo, k, 0];
        return n_player;
        }else{
          return c;
        }
    });
    const nm: Model = [cam, n_characs,cells,pmtr]; 
    return nm;
    }
  

  const jump = (m: Model):Model => {
    const [cam, chars,cells,pmtr]:Model = m;
    const jumpVel = pmtr[2], gravity = pmtr[0];
    const n_chars = chars.map(c => {
      if( c[8] == 'player'){
          const [px,py,pw,ph,pVx,pVy,dir,onflo,k] = c;
          if(onflo){
            const p: Character = [px,py,pw,ph,pVx,jumpVel,dir,false,k, 0]
            return p;
          }else{
            return c;
          }
      }else{
        return c;
      } 
    })
    return [cam, n_chars,cells,pmtr];
  } 

  const stop = (m: Model):Model => {
    const [cam, chars,cells,prmtr]:Model = m;
    const n_chars = chars.map(c =>{
      if(c[8] == 'player'){
        const [px,py,pw,ph,pVx,pVy,dir,onflo,k] = c;
        const n_char:Character = [px,py,pw,ph,0,pVy,dir,onflo,k, 0]
        return n_char;
      }else{
         return c;
      }
    })
    return [cam, n_chars,cells,prmtr]; 
  }

const applyPhysics = (m: Model, delta: number):Model => applyMotion(m,delta);

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
    renderExt(m,map,tileSize,mapSize);
}
export const subs = (m: Model) => {
  const zero: Time = {kind:"time", delta: 0}; 
  return [clockSub,pressKeySub, releaseKeySub];
}
export const initStateCmd:[Model,Cmd<Action>] = [initState, emptyCmd()]

runGame( update, render,  subs, initStateCmd);  
