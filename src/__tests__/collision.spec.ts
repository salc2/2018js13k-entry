import {tileNumberByXYPos, getAABB, moveBody } from '../collision';
import {Character} from '../state';

test('tile number by x,y position when', () => {
  expect(tileNumberByXYPos(5,4,20,2)).toBe(0);
  expect(tileNumberByXYPos(21,21,20,2)).toBe(3);
  expect(tileNumberByXYPos(21,5,20,2)).toBe(1);
  expect(tileNumberByXYPos(5,21,20,2)).toBe(2);
  expect(tileNumberByXYPos(25,65,20,4)).toBe(13);
});

test('AABB of a body in [5,5] with w:40 and h:25 should be [5,5|45,5|45,30|5,30]', () => {
  expect(getAABB(5,5,40,25)).toEqual([[5,5],[45,5],[45,30],[5,30]]);
});

test('moving bodies in a map with solid tile', () => {
    const body:Character = [5,6,20,20,0,0,"right",true,"player", 0];
    const map = "``````````xxxxx``````````";

  expect(moveBody(body,7,8,map,20,5)).toEqual([7,8,20,20,0,0,"right",false]);
  expect(moveBody(body,25,25,map,20,5)).toEqual(body);
});



