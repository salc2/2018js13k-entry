import {createAndSetupTexture, g} from './render.webgl';

const canvasUI = document.createElement("canvas")
canvasUI.id = "ui";
document.body.appendChild(canvasUI)
//canvasUI.style ="left: -1000";
const ctx = canvasUI.getContext("2d");

const uiImg = new Image()
uiImg.src = "./ui_compo.png"
const text = createAndSetupTexture(g);


export function renderUi(){
    ctx.drawImage(uiImg,0,0);
    g.bindTexture(g.TEXTURE_2D, text);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, canvasUI);
    return text;
}


