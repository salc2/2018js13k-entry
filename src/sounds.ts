import './lib/jsfxr.min';

declare var jsfxr:any;

 const soundURL = jsfxr([1,,0.1643,,0.4493,0.4014,,0.1949,,,,,,,,0.5022,,,1,,,,,0.5]); 
 export const walking = new Audio();
 walking.src = soundURL;
 walking.play();
