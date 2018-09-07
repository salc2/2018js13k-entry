import {Subscriber, create} from './sub';
import {Cmd, emptyCmd, create as createCmd} from './cmd';
import {runGame, Update} from './game.runner';
import {render as renderExt} from './render';
import {initState, Spacing, State, moveCamera, Body, insertInCells} from './state';
//import {renderDebug,updateDebug} from './debug';
import {Time, Action, LeftPressed, LeftReleased, RightPressed, RightReleased} from './actions';
import {moveBody, gtn, gab, collide} from './collision';

export type Model = State;

const tileSize = 20, mapSize = 50;

const clockSub = create('c1', (consumer: Subscriber<Action>) => {
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

const touchsSub = create('t1', (consumer: Subscriber<Action>) => {
  const handlerStart = (ev: TouchEvent) => {
    switch (ev.currentTarget['id']) {
      case "a":
        consumer({kind:"up", delta:16})
        break;
      case "left":
        consumer({kind:"lp", delta:16})
        break;
      case "right":
        consumer({kind:"rp", delta:16})
        break;
      
      default:
        // code...
        break;
    }
    try{window.navigator.vibrate(30);}catch(e){} 
  }
  const handlerEnd = (ev: TouchEvent) => {
    switch (ev.currentTarget['id']) {
      case "left":
        consumer({kind:"lr", delta:16})
        break;
      case "right":
        consumer({kind:"rr", delta:16})
        break;
      default:
        // code...
        break;
    }
  }
    const svgs:any = document.querySelectorAll("rect");
    const psOp = {passive: true};
    svgs.forEach( rec =>{
      rec.addEventListener("touchstart",handlerStart,psOp);
      rec.addEventListener("touchend",handlerEnd,psOp);
    });

    return () => {
      svgs.forEach( rec =>{
       rec.removeEventListener("touchstart",handlerStart,psOp);
      rec.removeEventListener("touchend",handlerEnd,psOp);
    })
    }
  });



const pressKeySub = create('p1', (consumer: Subscriber<Action>) => {
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
        case 32:
          consumer({kind:"use",delta:16})
          break;
        default:
        break;
      } 
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  });

const releaseKeySub = create('r1', (consumer: Subscriber<Action>) => {
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

  const cameraMotion = (m:Model, delta: number):Model => {
    const [cam, characters,cells,pmtr,map,inv]:Model = m;
    if(cam[0] < cam[6]){
      moveCamera(cam,cam[6] * 0.075 * delta * 0.3,cam[1],1000,1000 )
    }else if(cam[0] > cam[6]){
      moveCamera(cam,cam[6] * 0.075 * delta * 0.3,cam[1],1000,1000 )
    }
    return [cam, characters,cells,pmtr,map,inv];
  }

  const applyMotion = (m: Model, delta: number):Model => {
    let [cam, characters,cells,pmtr,map,inv]:Model = insertInCells(m,new Array(m[4].length),20,50);
    const gravity = pmtr[0];
    const n_characters = characters.map(c => {
      const [px,py,pw,ph,pVx,pVy,dir,onflo,kind,id,,act] = c;
      const playr:Body = moveBody(c,(px+pVx*delta),(py+pVy*delta),map,20,50,cells);
      playr[5] = Math.min(pVy+gravity,gravity)
      //playr[11] = Math.max(0,act-delta)  
      return playr;
    });
    const pp = characters.filter(c => c[8] == "player")[0];
    const cqtr = cam[2]/7;
    if(pp[0] < cam[0] + (cqtr*2)){
      cam = moveCamera(cam,cam[0] - (delta*0.075),cam[1],1000,1000);
    }else if(pp[0] > (cam[0]+ cam[2])-(cqtr*4)){
      cam = moveCamera(cam,cam[0] + (delta*0.075),cam[1],1000,1000);
    }
    return [cam, n_characters,cells,pmtr,map,inv];
  }

  const walkLeft = (m: Model):Model => {
    const [cam, characters,cells,pmtr,map,inv]:Model = m;
    const vplayer = pmtr[1];
    const n_characters = characters.map(c =>{
      if(c[8] == 'player'){
              const [px,py,pw,ph,pVx,pVy,dir,onflo, kind,id,act] = c;
              const nplayer:Body = [px,py,pw,ph,-vplayer,pVy,"l",onflo, kind,id, 0,act];
              return nplayer;
      }else{
        return c;
      }
    })
    const nm: Model = [cam,n_characters,cells,pmtr,map,inv]; 
    return nm;
  }

  const walkRight = (m: Model):Model => {
    const [cam, characters,cells,pmtr,map,inv]:Model = m;
    const vplayer = pmtr[1];
    const n_characs = characters.map( c => {
      if(c[8] == 'player'){
        const [px,py,pw,ph,pVx,pVy,dir,onflo, k, id,act] = c;
        const n_player: Body = [px,py,pw,ph,vplayer,pVy,"r",onflo, k,id, 0,act];
        return n_player;
        }else{
          return c;
        }
    });
    const nm: Model = [cam, n_characs,cells,pmtr,map,inv]; 
    return nm;
    }
  

  const jump = (m: Model):Model => {
    const [cam, chars,cells,pmtr,map,inv]:Model = m;
    const jumpVel = pmtr[2], gravity = pmtr[0];
    const n_chars = chars.map(c => {
      if( c[8] == 'player'){
          const [px,py,pw,ph,pVx,pVy,dir,onflo,k,id,act] = c;
          if(onflo){
            const p: Body = [px,py,pw,ph,pVx,jumpVel,dir,false,k,id,0,act]
            return p;
          }else{
            return c;
          }
      }else{
        return c;
      } 
    })
    return [cam, n_chars,cells,pmtr,map,inv];
  } 

  const stop = (m: Model):Model => {
    const [cam, chars,cells,prmtr,map,inv]:Model = m;
    const n_chars = chars.map(c =>{
      if(c[8] == 'player'){
        const [px,py,pw,ph,pVx,pVy,dir,onflo,k,id,act] = c;
        const n_char:Body = [px,py,pw,ph,0,pVy,dir,onflo,k,id, 0,act]
        return n_char;
      }else{
         return c;
      }
    })
    return [cam, n_chars,cells,prmtr,map,inv]; 
  }

const applyPhysics = (m: Model, delta: number):Model => applyMotion(m,delta);

export const update: Update<Action,Model> = (a: Action, m: Model) => {
  switch (a.kind) {
    case "t":
      return [ applyPhysics(m,a.delta) ,emptyCmd<Action>()];
    case "up":
      return [ jump(m), emptyCmd<Action>()];
    case "lp":
      return [ walkLeft(m),emptyCmd<Action>()];
    case "rp":
      return [ walkRight(m),emptyCmd<Action>()];
    case "lr":
      return [ stop(m),emptyCmd<Action>()];
    case "rr":
      return [ stop(m),emptyCmd<Action>()];
    case "use":
      return [ checkAction(m),emptyCmd<Action>()];
  }
}

const checkAction = (m: Model): Model => {
  let [cam, characters,cells,pmtr,map]:Model = insertInCells(m,new Array(2500),20,50);


    return m;
};

export const render = (onEvent:(a:Action) => void) => (m: Model) => {
    renderExt(m,m[4],tileSize,mapSize);
}
export const subs = (m: Model) => {
  const zero: Time = {kind:"t", delta: 0}; 
  return [clockSub, pressKeySub, releaseKeySub, touchsSub];
}
export const initStateCmd:[Model,Cmd<Action>] = [initState, createCmd(()=>{
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    const svgs: any = document.querySelectorAll("svg")
      svgs.forEach( svg => {
        svg.style.display = "block";
      });
  }
 // playTheme();
},null)]

runGame( update, render,  subs, initStateCmd);  
