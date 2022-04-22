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

let cappedFPS:number = 120;
let timer: number = 0;
let player: Player;
let directions: boolean[] = [false, false, false, false];
let map:GameMap;

function resizeHandler(): void {
	app.renderer.resize(window.innerWidth, window.innerHeight);

	map.position.set(app.screen.width / 2, app.screen.height / 2);
}

function move(): void {
	let timeNow = new Date().getTime();
	if(timeNow - timer <= 1000/cappedFPS)
		return;
	
	let movementVector:number[] = moveEntity(directions, 6);

	player.position.x -= movementVector[0];
	player.position.y -= movementVector[1]; 
	map.pivot.copyFrom(player.position);

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
	let player2 = new Player("je t'ai bien eu raph :)", app.loader.resources["playerSpritesheet"].spritesheet!);

	map = new GameMap();
	map.generateView();

	player.position.set(500, 500);
	player2.position.set(505, 505);
	map.position.set(window.innerWidth/2, window.innerHeight/2);

	app.stage.addChild(map);
	map.addChild(player);
	map.addChild(player2);
	map.pivot.copyFrom(player.position);

	app.ticker.add(move);
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

app.loader.onComplete.add(initApp);

loadResources();
