import {State, Kind, Body, Inventory} from './State';
const canvasUI:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("u");
const ctx = canvasUI.getContext("2d");
const uiImg = new Image();
uiImg.src = "./ui_compo.png";
const coord = { 
    'h': [ 0, 0, 10, 8 ],
  'k': [ 0, 8, 13, 5 ],
  's': [ 0, 13, 9, 10 ] };


ctx.font = '8px Verdana';
var start = performance.now() + 22000;
ctx.fillStyle = "#ffffff";
//ctx.fillStyle = "#54ed25";

export function renderUi(st:State){
    ctx.clearRect(0,0,180,100);
    ctx.canvas.style.width = window.innerWidth+"px";
    ctx.canvas.style.height = window.innerHeight+"px";
    const player = st[1].filter(c => c[8] == "player")[0]
    renderHeart(player);
    renderInven(st[5]);
    renderServer(st[1]);
 //   renderMsg(st);
}
function renderHeart(player:Body){
    ctx.fillText(player[11].toString(),15,10);
    ctx.drawImage(uiImg,0, 0, 10, 8,3,3,10, 8);
}
function renderInven(inv:Inventory){
    var k = 0,p = 0;
    for(var i = 0; i< inv.length;i++){
        if(inv[i][1] == "key"){
            k++;
        }
    }
    ctx.fillText(k.toString(),35,10);
    ctx.drawImage(uiImg,0, 8, 13, 5,42,4,13, 5);
}

function renderServer(bodies:Body[]){
    var n = 0;
    var d = 0;
    for(var i = 0; i< bodies.length;i++){
        if(bodies[i][8] == "server"){
            n ++;
            d = bodies[i][11] < 0 ? d + 1 : d;
        }
    }
    ctx.fillText(d+"/"+n,60,10);
    ctx.drawImage(uiImg,0, 13, 9, 10,75,3,9, 10);
}

function renderMsg(st:State){
    if(st[7] != ""){
    ctx.fillStyle = "#000000";
    ctx.clearRect(0,0,180,100);
    ctx.fillRect(0,0,180,100);
    ctx.font = '22px Verdana';
    ctx.fillStyle = "#ffffff";
    ctx.fillText(st[7],10,35);
    }
}

export function intro(time: number){
   ctx.canvas.style.width = window.innerWidth+"px";
    ctx.canvas.style.height = window.innerHeight+"px";
    ctx.fillStyle = "#000000";
    ctx.clearRect(0,0,180,100);
    ctx.fillRect(0,0,180,100);
    ctx.font = '8px Verdana';
    ctx.fillStyle = "#54ed25";

    const words = "Hi there, I am Antonia. since years big corporations had spent lot of resources researching AI fields. 'Cloud Computing' and 'Machine Learning', it will be a good idea they said. Well  apparently they learnt... and more than they had to. Now they want to dominate us. Let's stop them smashing any datacenter we see.";
  
ctx.font = '8px Verdana';
animateText(time,words)
ctx.fillStyle = "#ffffff";
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function animateText(st,word){
  var cur = Math.floor(performance.now() * 0.1 % 2) == 0 ? "|" : ""; 
  if(performance.now() > st){
    wrapText(ctx, word + ""+cur, 8, 15, 170, 10);
    return;
  }

   var t = Math.floor(performance.now() * 0.01 % word.length + 1);
   var result = ""
    for(var o = 0; o < t; o++){
            result = result + word.charAt(o)
    }
  
   wrapText(ctx, result + " "+cur, 8, 15, 170, 10); 
}


