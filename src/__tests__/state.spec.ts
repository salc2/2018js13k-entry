import {moveCamera, getTilesFromStringMap, Spacing, State} from '../state';

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


