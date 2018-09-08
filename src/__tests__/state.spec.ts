import {moveCamera, tilesFromMap, Spacing, State, Body, Camera, insertInCells} from '../state';
import {Action} from '../actions';
import {gtn,gab,collide} from '../collision'

test('players in map should be in cells', () =>{
    const p: Body = [23,23,1,1,0,0,'l',true,'player', 0,1,0];
    const s: State = [[0,0,0,0,0,0,0], [p],[],[0,0,0],"",[]];
    expect(insertInCells(s,new Array(4),20,2)[2][3]).toEqual([p])
});

test('players and enemy in map should be in cells', () =>{
    const p: Body = [43,23,1,1,0,0,'l',true,'player', 0,1,0];
    const e: Body = [53,25,1,1,0,0,'r',true,'vending', 0,2,0];
    const s: State = [[0,0,0,0,0,0,0], [p,e],[],[0,0,0],"",[]];
    expect(insertInCells(s,new Array(25),20,5)[2][7]).toEqual([p,e])
});

test('move camera from 5,4 to 105,335', () => {
    const camera:Camera = [5,4,180,100,0,0,0];
  expect(moveCamera(camera,105,335,1000,1000)).toEqual([105,335,180,100,0,0, 0]);
});

test('move camera from 0,0 to 1005, 3335 should keep inside limits', () => {
    const camera:Camera = [5,4,180,100,0,0,0 ];
  expect(moveCamera(camera,1005,3335,1000,1000)).toEqual([820,900,180,100,0,0,0]);
});

test('move camera to negative', () => {
    const camera:Camera = [5,4,180,100,0,0,0];
  expect(moveCamera(camera,-100,-100,1000,1000)).toEqual([0,0,180,100,0,0,0]);
});

function useDoors(m:State): State {
  let [cam, characters,cells,pmtr,map,inv]:State = insertInCells(m,new Array(100),20,10);
  let xToGo:number ,yToGo: number, serverOn, currentDev:Body;
  const player:Body = characters.filter(c => c[8]=="player")[0];
  const [px,py,pw,ph] = player;
gab(px,py,pw,ph).map(xy => gtn(xy[0],xy[1],20,10)).map(tn => cells[tn]).forEach(objects =>{
  if(objects){
    objects.filter(obj => {
      const [ox,oy,ow,oh] = obj;
      const [px,py,pw,ph] = player;
      return collide([px,py,pw,ph],[ox,oy,ow,oh]);
    }).forEach(obj =>{
        if(obj[8] == "door"){
           const parId = obj[10];
           const dest = characters.filter( oth => oth[9] == parId)[0];
           const idKey = dest[11];
           if(idKey > 0){
             if(inv.filter(el => el[1] == "key")
             .map(elm => elm[0] == idKey).indexOf(true,idKey) > -1){
               xToGo = dest[0];
               yToGo = dest[1];
             }
           }else{
              xToGo = dest[0];
             yToGo = dest[1];
           }
        }else if(obj[8] == "server"){
               const pendId = obj[11];
            if(inv.filter(el => el[1] == "pendrive")
             .map(elm => elm[0]).indexOf(pendId) > -1){
              obj[10] = 0;
             }
        }
    });
  }
});

if(xToGo && yToGo){
   cam[0] = xToGo;
   cam[1] = yToGo;
   player[0] = xToGo;
   player[1] = yToGo;
   const ns: State = [cam, characters,[],pmtr,map,inv]; 
  return ns;
}else{
  return m;
}
}

test('test using doors', () => {
  const player:Body = [21,21,8,20,0,0.058,'r',true, "player", 0, 0,0];
  const door1:Body = [21,21,20,20,0,0,'r',true, "door", 1, 2,-1];
  const door2:Body = [101,21,20,20,0,0,'r',true, "door", 2, 1,-1];
  const camera:Camera = [10,10,180,100,0,0,0];
  const state:State = [camera,[player,door1,door2],[], [0,0,0],"",[]];

  const playerExpected:Body = [101,21,8,20,0,0.058,'r',true, "player", 0, 0,0];
  const cameraExpected:Camera = [101,21,180,100,0,0,0];
  const stateExpeced:State = [cameraExpected,[playerExpected,door1,door2],[], [0,0,0],"",[]];
  expect(useDoors(state)).toEqual(stateExpeced);
});


test('test doors with key', () => {
  const player:Body = [21,21,8,20,0,0.058,'r',true, "player", 0, 0,0];
  const door1:Body = [21,21,20,20,0,0,'r',true, "door", 1, 2,88];
  const door2:Body = [101,21,20,20,0,0,'r',true, "door", 2, 1,-1];
  const camera:Camera = [10,10,180,100,0,0,0];
  const state:State = [camera,[player,door1,door2],[], [0,0,0],"",[]];
  expect(useDoors(state)).toEqual(state);

  const playerExpected:Body = [101,21,8,20,0,0.058,'r',true, "player", 0, 0,0];
  const cameraExpected:Camera = [101,21,180,100,0,0,0];
  
  const stateKey:State = [camera,[player,door1,door2],[], [0,0,0],"",[ [88,"key"] ]];
  const stateExpeced:State = [cameraExpected,[playerExpected,door1,door2],[], [0,0,0],"",[ [88,"key"] ]];
  expect(useDoors(stateKey)).toEqual(stateExpeced);
});

test('test turn off server', () => {
  const player:Body = [21,21,8,20,0,0.058,'r',true, "player", 0, 0,0];
  const server1:Body = [21,21,20,20,0,0,'r',true, "server", 1, 1,88];
  const camera:Camera = [10,10,180,100,0,0,0];
  const state:State = [camera,[player,server1],[], [0,0,0],"",[]];
  expect(useDoors(state)).toEqual(state);

  const serverExpected:Body = [21,21,20,20,0,0,'r',true, "server", 1, 0,88];
  const stateExpeced:State = [camera,[player,serverExpected],[], [0,0,0],"",[ [88,"pendrive"] ]];
  const stateWithPen:State = [camera,[player,server1],[], [0,0,0],"",[[88,"pendrive"]]];
  expect(useDoors(stateWithPen)).toEqual(stateExpeced);
});


const map = "%^&``*@£````````````````";

test('get tiles id by camera and string map', () => {
  const camera:Camera = [0,0,60,40,0,0, 0];
  expect(tilesFromMap( [0,0,60,40,0,0],map,20)).toEqual([ '%', '*', '^', '@', '&', '£' ]);
});

test('get tiles id by camera and string map', () => {
  const camera:Camera = [40,20,60,40,0,0,0];
 expect(tilesFromMap([40,20,60,40,0,0],map,20)).toEqual([ '£', '`', '`', '`', '`', '`' ]);
});


