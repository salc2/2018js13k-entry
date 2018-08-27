import {Subscriber, create} from './sub';
import {Cmd, emptyCmd, create as createCmd} from './cmd';
import {runGame, Update} from './game.runner';
import {render as renderExt} from './render';
import {jump as soundJump} from './sounds';
import {initState, Spacing, State, moveCamera, Character, Enemy, insertInCells} from './state';
import {renderDebug,updateDebug} from './debug';
import {Time, Action, LeftPressed, LeftReleased, RightPressed, RightReleased} from './actions';
import {moveBody, tileNumberByXYPos, getAABB, collide} from './collision';

export type Model = State;

const tileSize = 20, mapSize = 50;

const clockSub = create('clock', (consumer: Subscriber<Action>) => {
    let id = 0;
    let startTime = performance.now();
    const keepAnimation = (time:number) => {
      let t = time - startTime;
      consumer({kind: "t",delta:t});
      startTime = time;
      id = requestAnimationFrame(keepAnimation);
    };
    id = requestAnimationFrame(keepAnimation);
    return () => cancelAnimationFrame(id);
  });


const pressKeySub = create('pressEvents', (consumer: Subscriber<Action>) => {
    const handler = (e: KeyboardEvent) => {
      switch(e.keyCode){
        case 37: 
          consumer({kind:"lp",delta:16})
          break;
        case 39:
          consumer({kind:"rp",delta:16})
          break;
        case 38:
          consumer({kind:"up",delta:16})
          break;
        default:
        break;
      } 
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  });

const releaseKeySub = create('pressEvents', (consumer: Subscriber<Action>) => {
    const handler = (e: KeyboardEvent) => {
      switch(e.keyCode){
        case 37: 
          consumer({kind:"lr",delta:16})
          break;
        case 39:
          consumer({kind:"rr",delta:16})
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
    let [cam, characters,cells,pmtr]:Model = m;
    const gravity = pmtr[0];
    const n_characters = characters.map(c => {
      const [px,py,pw,ph,pVx,pVy,dir,onflo,kind] = c;
      const playr:Character = moveBody(c,(px+pVx*delta),py+pVy,map,20,50);
      playr[5] = Math.min(pVy+gravity,gravity)  
      return playr;
    });
    const pp = characters.filter(c => c[8] == "player")[0];
    const cqtr = cam[2]/7;
    if(pp[0] < cam[0] + (cqtr*2)){
      cam = moveCamera(cam,cam[0] - (delta*0.075),cam[1],1000,1000);
    }else if(pp[0] > (cam[0]+ cam[2])-(cqtr*4)){
      cam = moveCamera(cam,cam[0] + (delta*0.075),cam[1],1000,1000);
    }
    return [cam, n_characters,cells,pmtr];
  }

  const checkCollides = (m: Model):Model => {
    let [cam, characters,cells,pmtr]:Model = insertInCells(m,new Array(2500),20,50);
    const p = characters.filter(c => c[8] == "player")[0];
    getAABB(p[0],p[1],p[2],p[3]).map(xy => tileNumberByXYPos(xy[0],xy[1],tileSize,mapSize)).map(tn => cells[tn]).forEach(enemies =>{
      enemies.filter(e => e != p).forEach(e => {
        const [ex,ey,ew,eh] = e;
        if(collide([p[0],p[1],p[2],p[3]],[ex,ey,ew,eh])){
          if(p[1]+p[3] < ey+3){
            console.log("enemy down")
            e[10] = 0;
          }else{
            console.log("player down")
          }
        }
      })
    });

    return m;
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

const applyPhysics = (m: Model, delta: number):Model => applyMotion(checkCollides(m),delta);

export const update: Update<Action,Model> = (a: Action, m: Model) => {
  switch (a.kind) {
    case "t":
      return [ applyPhysics(m,a.delta) ,emptyCmd<Action>()];
    case "up":
      return [ jump(m),createCmd<Action>( () => soundJump.play(), null )];
    case "lp":
      return [ walkLeft(m),emptyCmd<Action>()];
    case "rp":
      return [ walkRight(m),emptyCmd<Action>()];
    case "lr":
      return [ stop(m),emptyCmd<Action>()];
    case "rr":
      return [ stop(m),emptyCmd<Action>()];
  }
}

export const render = (onEvent:(a:Action) => void) => (m: Model) => {
    renderExt(m,map,tileSize,mapSize);
}
export const subs = (m: Model) => {
  const zero: Time = {kind:"t", delta: 0}; 
  return [clockSub,pressKeySub, releaseKeySub];
}
export const initStateCmd:[Model,Cmd<Action>] = [initState, emptyCmd()]

runGame( updateDebug, renderDebug,  subs, initStateCmd);  
