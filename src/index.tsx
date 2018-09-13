import {Subscriber, create} from './sub';
import {Cmd, emptyCmd, create as createCmd} from './cmd';
import {runGame, Update} from './game.runner';
import {render as renderExt} from './render';
import {ArtifactoryType,Artifactory,initState, Spacing, State, moveCamera, Body, insertInCells, openUse} from './state';
//import {renderDebug,updateDebug} from './debug';
import {isEnemy} from './utils';
import {Time, Action, LeftPressed, LeftReleased, RightPressed, RightReleased} from './actions';
import {moveBody, gtn, gab, collide} from './collision';
import {playSound} from './sound'
import {showMessage} from './render.ui'

export type Model = State;

const tileSize = 20, mapSize = 50;

const clockSub = create('c1', (consumer: Subscriber<Action>) => {
  let id = 0;
  let startTime = 0;
  const keepAnimation = (time:number) => {
    let t = time - startTime;
    t = t > 17 ? 16 : t;
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
      case "b":
      consumer({kind:"attkp", delta:16})
      break;
      case "left":
      consumer({kind:"lp", delta:16})
      break;
      case "right":
      consumer({kind:"rp", delta:16})
      break;
      case "up":
      consumer({kind:"use", delta:16})
      break;
      
      default:
        // code...
        break;
      }
    }
    const handlerEnd = (ev: TouchEvent) => {
      switch (ev.currentTarget['id']) {
        case "b":
        consumer({kind:"attkr", delta:16})
        break;
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
      case 13:
      consumer({kind:"use",delta:16})
      break;
      case 32:
      consumer({kind:"attkp",delta:16})
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
      case 32:
      consumer({kind:"attkr",delta:16})
      break;
      default:
      break;
    } 
  }; 
  window.addEventListener('keyup', handler, true);
  return () => window.removeEventListener('keyup', handler, true);
});

const applyMotion = (m: Model, delta: number):[Model,Cmd<Action>] => {
  let cmdSound: Cmd<Action> = emptyCmd();
  let [cam, characters,cells,pmtr,map,inv,tt,msg]:Model = insertInCells(m,new Array(m[4].length),20,50);
  const pp = characters.filter(c => c[8] == "player")[0];
  const gravity = pmtr[0];
  const n_characters = characters.map(c => {
    const [px,py,pw,ph,pVx,pVy,dir,onflo,kind,id,n,act] = c;
    let _pVy = c[8] == "drone" && c[11] == 0 ? 0 : pVy;
    const [playr,sounds] = moveBody(c,(px+pVx*delta),(py+_pVy*delta),map,20,50,cells);
    cmdSound = sounds;
    playr[5] = Math.min(pVy+gravity,gravity)
    return playr;
  });
  const cqtr = cam[2]/7;
  if(pp[0] < cam[0] + (cqtr*2)){
    cam = moveCamera(cam,cam[0] - (delta*0.075),cam[1],1000,1000);
  }else if(pp[0] > (cam[0]+ cam[2])-(cqtr*4)){
    cam = moveCamera(cam,cam[0] + (delta*0.075),cam[1],1000,1000);
  }
  const mdl = cam[3]/5;
  if(pp[1] - (cam[1]+mdl) < 70){
    cam = moveCamera(cam,cam[0],cam[1] - (delta*0.075),1000,1000);
  }else if(pp[1] - (cam[1]+mdl) > 70){
    cam = moveCamera(cam,cam[0],cam[1] + (delta*0.075),1000,1000);
  }
  const nm: Model  =[cam, n_characters,cells,pmtr,map,inv,tt,msg];
  return [nm,cmdSound];
}

const walkLeft = (m: Model):Model => {
  const characters = m[1];
  const vplayer = m[3][1];
  characters.forEach(c =>{
    if(c[8] == 'player'){
      c[4] = -vplayer;
      c[6] = "l";
    }
  });
  return m;
}

const fillingInventory = (m: Model):Model => {
  const ids = m[5].map(i => i[0]) || [];
  m[1].filter( c => c[0] < -1 && (c[8] == "key" || c[8] == "hammer") )
  .forEach(fnd => {
    if(ids.indexOf(fnd[9]) < 0){
      const at:ArtifactoryType = fnd[8] == "key" ? "key" : "hammer";
      m[5].push( [fnd[9], at]); 
    }
  });
  return m;
};

const walkRight = (m: Model):Model => {
  const characters = m[1];
  const vplayer = m[3][1];
  characters.forEach(c =>{
    if(c[8] == 'player'){
      c[4] = vplayer;
      c[6] = "r";
    }
  });
  return m;
}


const jump = (m: Model):Model => {
  const characters = m[1];
  const jumpVel = m[3][2];
  characters.forEach(c =>{
    if(c[8] == 'player' && c[7]){
      c[5] = jumpVel;
      c[7] = false;
    }
  });
  return m;
} 

const stop = (m: Model):Model => {
  const characters = m[1];
  characters.forEach(c =>{
    if(c[8] == 'player'){
      c[4] = 0;
      c[10] = 0;
    }
  });
  return m;
}

const passingTime = (m: Model, delta: number):[Model,Cmd<Action>] => {
  const [nm, cmdEffects] = applyMotion(m,delta)
  const _nm = recoveryEnemies(evalVictoryDefeat(fillingInventory(nm)),delta)
  return [_nm,cmdEffects];
};

export const update: Update<Action,Model> = (a: Action, m: Model) => {
  switch (a.kind) {
    case "t":
    return passingTime(m,a.delta);
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
    return [ openUse(m),emptyCmd<Action>()];
    case "attkp":
    return [ attackMode(m),emptyCmd<Action>()];
    case "attkr":
    return [ stop(m),emptyCmd<Action>()];
  }
}

const haveHammer = (inv: Artifactory[]):Boolean => {
  let result = false;
  for(var i =0;i< inv.length;i++){
    if(inv[i][1] == "hammer"){
      result = true;
    }
  }
  return result;
}
const attackMode = (m:Model):Model => {
  for(var i =0;i< m[1].length;i++){
    if(m[1][i][8]=="player" && haveHammer(m[5])){
      m[1][i][10] = 1; 
    }
  }
  m[6] = m[6] - m[6]; 
  return m;
}

const evalVictoryDefeat = (m:Model): Model => {
  const p = m[1].filter(c => c[8] =="player")[0];
  if(p[11] < 0){
    m[7] = "Game Over!";
  }
  var n = 0;
  var d = 0;
  for(var i = 0; i< m[1].length;i++){
    if(m[1][i][8] == "server"){
      n ++;
      d = m[1][i][11] < 0 ? d + 1 : d;
    }
  }
  if(n == d){
    m[7] = "You won! they are offline.";
  }
  return m;
}

const recoveryEnemies = (m:Model, delta: number): Model => {
  m[1].forEach(c => {
    if(isEnemy(c)){
      c[11] = Math.max(0, c[11] - delta);

      if(c[11] < 100 && c[11] != 0){
        c[1] = c[1]-5;
        c[3] = 21;
        c[4] = c[6] == "r" ? 0.03 : -0.03;
      }else if(c[11] > 100){
        c[4] = 0;
        c[3] = 13;
      }
    }
  });
  return m;
}

const words = "Use arrows + space + enter in desktop, virtual gamepad in mobile. and smash all datacenters";

export const render = (onEvent:(a:Action) => void) => (m: Model) => {
    if(performance.now() > m[6]+2000){
    renderExt(m,m[4],tileSize,mapSize);

    }else{
      showMessage(words,m[6])
    }

    
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

    playSound();
  },null)]

  runGame( update, render,  subs, initStateCmd);  
