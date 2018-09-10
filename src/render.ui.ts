import {State, Kind, Body, Inventory} from './State';
const canvasUI:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("u");
const ctx = canvasUI.getContext("2d");
const uiImg = new Image();
uiImg.src = "./ui_compo.png";
const coord = {
  'h': [ 0, 0, 10, 8 ],
  'k': [ 10, 0, 13, 5 ],
  'p': [ 23, 0, 9, 8 ] };

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
        }else if(inv[i][1] == "pendrive"){
            p++;
        }
    }
    ctx.fillText(k.toString(),35,10);
    ctx.drawImage(uiImg,10, 0, 13, 5,42,4,13, 5);
    ctx.fillText(p.toString(),60,10);
    ctx.drawImage(uiImg,23, 0, 9, 8,67,3,9, 8);
}

function renderMessage(){

}


