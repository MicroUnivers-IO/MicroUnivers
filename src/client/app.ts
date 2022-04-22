import { Application, AnimatedSprite, Spritesheet, Container } from 'pixi.js'
import { moveEntity } from './game/movement';
import { GameMap } from './game/map';
import { Player } from './game/player';
import { getDirections } from './game/ActionHandler';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	resizeTo: window,
	backgroundColor: 0x000000
});

let currentWidth: number = window.innerWidth;
let currentHeight: number = window.innerHeight;
let cappedFPS:number = 120;
let timer: number = 0;
let player: Player;
let directions: boolean[] = [false, false, false, false];
let map:GameMap;

function resizeHandler(): void {
	let offsetW:number = currentWidth - window.innerWidth;
	let offsetH:number = currentHeight - window.innerHeight;

	map.position.set(map.x - (offsetW / 2), map.y - (offsetH / 2));	
	player.position.set(window.innerWidth/2, window.innerHeight/2);

	currentWidth = window.innerWidth;
	currentHeight = window.innerHeight;
}

function move(): void {
	let timeNow = new Date().getTime();
	if(timeNow - timer <= 1000/cappedFPS)
		return;
	
	let movementVector:number[] = moveEntity(directions, 6);

	app.stage.removeChild(player);
	player.manageWalk(directions[2]);
	app.stage.addChild(player);

	map.position.x += movementVector[0];
	map.position.y += movementVector[1]; 

	timer = timeNow;
}

function handleKeydown(event: KeyboardEvent): void {
    directions = getDirections(directions, event.key, true);
}

function handleKeyup(event: KeyboardEvent): void {
	directions = getDirections(directions, event.key, false);
}

function loadResources(): void {
	app.loader.add("playerSpritesheet", "assets/player/player.json");

	for (let i = 1; i <= 32; i++) 
		app.loader.add('assets/tileset/field_' + i.toString().padStart(2, '0') + '.png');

	for (let i = 1; i <= 6; i++) 
		app.loader.add('assets/tileset/bush_' + i.toString().padStart(2, '0') + '.png');

	for (let i = 1; i <= 16; i++) 
		app.loader.add('assets/tileset/grass_' + i.toString().padStart(2, '0') + '.png');

	for (let i = 1; i <= 3; i++) 
		app.loader.add('assets/tileset/trees_' + i.toString().padStart(2, '0') + '.png');

	app.loader.load();
}

function initApp():void {
	player = new Player("José", app.loader.resources["playerSpritesheet"].spritesheet!);

	map = new GameMap();
	map.generateView();

	player.position.set(window.innerWidth/2, window.innerHeight/2);
	map.position.set(0, 0);

	app.stage.addChild(map);
	app.stage.addChild(player);

	app.ticker.add(move);
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

app.loader.onComplete.add(initApp);

loadResources();
