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


