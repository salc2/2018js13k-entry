import {moveCamera, getTilesFromStringMap, Spacing, State, Character} from '../state';
import {tileNumberByXYPos} from '../collision'

const insertInCells = (s: State,tiles: Character[][],tileSize: number,worldSize: number): State => {
    const [c, chars,,pmr] = s;
    chars.forEach(c => { 
      const tile = tileNumberByXYPos(c[0], c[1], tileSize, worldSize);
      if(tiles[tile]){
        tiles[tile].push(c)
      }else{
        tiles[tile] = [c]
      }
    })
    return [c, chars,tiles,pmr];
}

test('players in map should be in cells', () =>{
    const p: Character = [23,23,1,1,0,0,'left',true,'player', 0];
    const s: State = [[0,0,0,0,0,0], [p],[],[0,0,0]];
    expect(insertInCells(s,new Array(4),20,2)[2][3]).toEqual(p)
});

test('move camera from 5,4 to 105,335', () => {
    const camera:Spacing = [5,4,180,100,0,0];
  expect(moveCamera(camera,105,335,1000,1000)).toEqual([105,335,180,100,0,0]);
});

test('move camera from 0,0 to 1005, 3335 should keep inside limits', () => {
    const camera:Spacing = [5,4,180,100,0,0];
  expect(moveCamera(camera,1005,3335,1000,1000)).toEqual([820,900,180,100,0,0]);
});


const map = "%^&``*@£````````````````";

test('get tiles id by camera and string map', () => {
  const camera:Spacing = [0,0,60,40,0,0];
  expect(getTilesFromStringMap(camera,map,20)).toEqual([ '%', '*', '^', '@', '&', '£' ]);
});

test('get tiles id by camera and string map', () => {
  const camera:Spacing = [40,20,60,40,0,0];
 expect(getTilesFromStringMap(camera,map,20)).toEqual([ '£', '`', '`', '`', '`', '`' ]);
});


