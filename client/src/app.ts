import { Application } from 'pixi.js'
import { Player } from './game/player';


const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 740,
	height: 310
});

let a = new Player();