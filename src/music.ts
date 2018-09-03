import * as TinyMusic from './lib/TinyMusic';

//declare var TinyMusic:any;

const ac:AudioContext = new AudioContext;
let when = ac.currentTime,
  tempo = 88;

var c5 = [];
var gb4 = [];
var ef4 = [];
var cb6_e5 = [];
var tmp = ['- 8','- e', 'F6 e', '- e', 'F5 e', '- e', 'G5 e', 'C6 e', 'G5 e', 'F6 e', '- e'];
var comC5 = tmp.concat(tmp);
var n = "F4 e";
for(var i =1; i <= 32;i++){
  c5.push('C5 e');
  c5.push('- e');
  gb4.push('Gb4 e');
  gb4.push('- e');
  ef4.push(n);
  ef4.push('- e');
  if(i % 8 == 0){
      n = n == "F4 e" ? "E4 e" : "F4 e"
 }
  if(i<=12){
    cb6_e5.push("Cb5 e");
   // cb6.push("- e");
    if(i % 4 == 0 && i != 12){
      cb6_e5.push("E5 e");
     // e5.push("E5 e")
    }else{
      cb6_e5.push("- e");
     // e5.push("- e");
    }
    
  }
}
cb6_e5.push('- 32');
// create 3 new sequences (one for lead, one for harmony, one for bass)
const sequence1 = new TinyMusic.Sequence( ac, tempo, c5 );
const sequence2 = new TinyMusic.Sequence( ac, tempo, gb4 );
const sequence3 = new TinyMusic.Sequence( ac, tempo, ef4 );
i = c5.length;
const c5cpy = Array(c5.length);
while(i--) c5cpy[i] = c5[i];
i = gb4.length;
const gb4cpy = Array(gb4.length);
while(i--) gb4cpy[i] = gb4[i];
i = ef4.length;
const ef4cpy = Array(ef4.length);
while(i--) ef4cpy[i] = ef4[i];


c5cpy.unshift('- 12');
gb4cpy.unshift('- 12');
ef4cpy.unshift('- 12');
const sequence1Cpy = new TinyMusic.Sequence( ac, tempo, c5cpy );
const sequence2Cpy = new TinyMusic.Sequence( ac, tempo, gb4cpy );
const sequence3Cpy = new TinyMusic.Sequence( ac, tempo, ef4cpy );
comC5.unshift('- 12');
const sequence4 = new TinyMusic.Sequence( ac, tempo, cb6_e5 );
const sequeComp = new TinyMusic.Sequence( ac, tempo, comC5 );
const piano = [-1,-0.9,-0.6,-0.3, 0, 0.3, 0.6, 0.9,1];
[sequence1,sequence2,sequence3,sequence4,sequeComp,sequence1Cpy,sequence2Cpy,
sequence3Cpy].forEach(function(seq){
  seq.createCustomWave(piano);
  seq.bass.gain.value = 10;
  seq.gain.gain.value = 0.08; // half volume
});

sequence1.loop = false;
sequence2.loop = false;
sequence3.loop = false;
sequence4.loop = false;
sequeComp.loop = false;
sequence1Cpy.loop = false;
sequence2Cpy.loop = false;
sequence3Cpy.loop = false;


export function playTheme() {
  when = ac.currentTime;
sequence1.play( when );
sequence2.play( when );
sequence3.play( when );

var i = setInterval(function(){
  sequence4.play();
sequence1Cpy.play();
sequence2Cpy.play();
sequence3Cpy.play();
sequeComp.play();
},when + ( 60 / tempo ) * 32 * 1000);
}


export function stopTheme() {
  sequence1.stop();
  sequence2.stop();
  sequence3.stop();
  sequence4.stop();
  sequeComp.stop();
  sequence1Cpy.stop();
  sequence2Cpy.stop();
  sequence3Cpy.stop();
}
