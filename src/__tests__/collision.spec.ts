import {gtn, gab, moveBody, collide} from '../collision';
import {Body} from '../state';

test('tile number by x,y position when', () => {
  expect(gtn(5,4,20,2)).toBe(0);
  expect(gtn(21,21,20,2)).toBe(3);
  expect(gtn(21,5,20,2)).toBe(1);
  expect(gtn(5,21,20,2)).toBe(2);
  expect(gtn(25,65,20,4)).toBe(13);
});

test('AABB of a body in [5,5] with w:40 and h:25 should be [5,5|45,5|45,30|5,30]', () => {
  expect(gab(5,5,40,25)).toEqual([[5,5],[45,5],[45,30],[5,30]]);
});

test('moving bodies in a map with solid tile', () => {
    const body:Body = [5,6,20,20,0,0,"r",true,"player", 0,1,0];
    const map = "``````````xxxxx``````````";

  expect(moveBody(body,7,8,map,20,5,[])).toEqual([7,8,20,20,0,0,"r",false,"player", 0,1,0]);

 // expect(moveBody(body,25,25,map,20,5,[])).toEqual(body);
});

type Object = [number,number,number,number];

test('collision between two bodies 1', () => {
  const body1:Object = [0,0,20,20];
  const body2:Object = [19,0,20,20];
  expect(collide(body1,body2)).toEqual(true);
});

test('collision between two bodies 2', () => {
  const body1:Object = [0,0,20,20];
  const body2:Object = [0,19,20,20];
  expect(collide(body1,body2)).toEqual(true);
});



