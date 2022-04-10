import { Application, AnimatedSprite, Texture, Sprite, Loader, Spritesheet, Container } from 'pixi.js'
import { GameMap } from './game/map';
import { Player } from './game/player';

// Creating the game app
const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: window.innerWidth - 20,
	height: window.innerHeight - 20,
});

// Player related data
let player: Player;
let playerSpriteSheet:Spritesheet
let playerAnimation:AnimatedSprite
let playerView: Container;

// Movement related data
let zPressed: boolean;
let sPressed: boolean;
let qPressed: boolean;
let dPressed: boolean;

// Map related data
let map:GameMap;
let mapContainer: Container;
let mapData;

export function resizeHandler() {
	app.stage.removeChildren();

    app.renderer.resize(window.innerWidth - 20, window.innerHeight - 20);
	map.generateView(app.screen.width, app.screen.height);
	app.stage.addChild(map.getView());

	playerView.x = app.screen.width / 2;
	playerView.y = app.screen.height / 2;
	app.stage.addChild(playerView);
}

function move() {
	if(zPressed) {
		mapContainer.y += player.getSpeed();
	}
	if(sPressed) {
		mapContainer.y -= player.getSpeed();
	}
	if(qPressed) {
		mapContainer.x += player.getSpeed();
	}
	if(dPressed) {
		mapContainer.x -= player.getSpeed();
	}
}

function manageWalk(activateWalk: boolean, reverse: boolean = false) {
	player.toggleWalk();
	if(activateWalk) {
		player.changeAnimation(new AnimatedSprite(playerSpriteSheet.animations["walk"]), reverse);
	}
	else{
		player.changeAnimation(new AnimatedSprite(playerSpriteSheet.animations["idle"]));
	}

	app.stage.removeChild(playerView);
	playerView = player.getView();
	app.stage.addChild(player.getView());
}

function handleKeypress(event: KeyboardEvent) {
	console.log(event);
	switch(event.key) {
		case "z":
		case "Z":
			if(!player.getWalking()) {
				manageWalk(true);
			}
			zPressed = true;
			break;
		case "s":
		case "S":
			if(!player.getWalking()) {
				manageWalk(true);
			}
			sPressed = true;
			break;
		case "q":
		case "Q":
			if(!player.getWalking()) {
				manageWalk(true, true);
			}
			qPressed = true;
			break;
		case "d":
		case "D":
			if(!player.getWalking()) {
				manageWalk(true);
			}
			dPressed = true;
			break;
	}
}

function handleKeyup(event: KeyboardEvent) {
	switch(event.key) {
		case "z":
		case "Z":
			if(player.getWalking()) {
				manageWalk(false);
			}
			zPressed = false;
			break;
		case "s":
		case "S":
			if(player.getWalking()) {
				manageWalk(false);
			}
			sPressed = false;
			break;
		case "q":
		case "Q":
			if(player.getWalking()) {
				manageWalk(false);
			}
			qPressed = false;
			break;
		case "d":
		case "D":
			if(player.getWalking()) {
				manageWalk(false);
			}
			dPressed = false;
			break;
	}
}

function loadResources() {
	fetch("assets/tileset/field.json")
	.then(response => {
		return response.json();
	})
	.then((data) => {initMap(data);})
	.then( () => {app.loader.load();});
}

function initMap(data) {
	mapData = data;
	map = new GameMap(mapData.layers[0].data, mapData.tilewidth, mapData.width, mapData.height);
	for (let i = 1; i < mapData.tilesets[0].tilecount; i++) 
		app.loader.add('assets/tileset/field_' + i.toString().padStart(2, '0') + '.png');
}

function initApp() {
	playerSpriteSheet = app.loader.resources["playerSpritesheet"].spritesheet;
	playerAnimation = new AnimatedSprite(playerSpriteSheet.animations["idle"]);
	player = new Player("José", playerAnimation);
	playerView = player.getView();
	
	playerView.x = app.screen.width / 2;
	playerView.y = app.screen.height / 2;

	map.generateView(app.screen.width, app.screen.height);
	mapContainer = map.getView();

	app.stage.addChild(mapContainer);
	app.stage.addChild(playerView);
	app.ticker.add(move, 150);
}

window.addEventListener("resize", resizeHandler);
window.addEventListener("keypress", handleKeypress);
window.addEventListener("keyup", handleKeyup);

app.loader.onComplete.add(initApp);
app.loader.add("playerSpritesheet", "assets/player/player.json");

loadResources();
