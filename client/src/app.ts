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
let mapX: number;
let mapY: number;

//TODO: Needs to be fixed : Reloading the assets moves the player's position on the map.
/**
 * Manages the event triggered by resizing the app.
 * 
 * Reloads the game's resources according to the new dimensions.
 */
export function resizeHandler() {
	app.stage.removeChildren();
	app.renderer.resize(window.innerWidth - 20, window.innerHeight - 20);
    initApp();
}

/**
 * Moves the player according to the key pressed.
 * 
 * The player isn't directly moving. Its view is changing by moving the map's position.
 * The player stays centered on screen.
 */
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
	mapX = mapContainer.x;
	mapY = mapContainer.y;
}

//TODO: Needs to be fixed : The animation sometimes cancels itself.
//TODO: Needs to be fixed : The reverse effect moves the player (probably because the container has wrong dimensions).
/**
 * Manages the player's walking animation.
 * 
 * Activates the walking animation if the player is not already walking.
 * Deactivates it if he stops moving.
 * 
 * @param activateWalk Whether to start or stop walking
 * @param reverse Whether to reverse the direction of the animation
 */
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

/**
 * Handles the event triggered by pressing a key.
 * 
 * Changes the values of the boolean variables related to the key pressed.
 * 
 * @param event The event that triggered the function call
 */
function handleKeydown(event: KeyboardEvent) {
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

/**
 * Handles the event triggered by releasing a key.
 * 
 * Changes the values of the boolean variables related to the key released.
 * 
 * @param event The event that triggered the function call
 */
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
/**
 * Loads the game's assets and resources.
 * 
 * Adds the player spritesheet to the app's loader.
 * Fetches the map's json to add its tiles to the app's loader.
 */
function loadResources() {
	app.loader.add("playerSpritesheet", "assets/player/player.json");

	fetch("assets/tileset/field.json")
	.then(response => {
		return response.json();
	})
	.then((data) => {loadMap(data);})
	.then( () => {app.loader.load();});
}

/**
 * Loads the map from the json data provided.
 * 
 * Creates a GameMap object from the data provided as a json object.
 * Also adds all the tiles png to the app's loader.
 * 
 * @param data The map's data
 */
function loadMap(data) {
	mapData = data;
	map = new GameMap(mapData.layers[0].data, mapData.tilewidth, mapData.width, mapData.height);
	for (let i = 1; i < mapData.tilesets[0].tilecount; i++) 
		app.loader.add('assets/tileset/field_' + i.toString().padStart(2, '0') + '.png');
}

/**
 * Initializes the app.
 * 
 * Creates the player and map objects, places them and adds them to the app.
 * Also adds the game's ticker for movements.
 */
function initApp() {
	// Creating the player
	playerSpriteSheet = app.loader.resources["playerSpritesheet"].spritesheet;
	playerAnimation = new AnimatedSprite(playerSpriteSheet.animations["idle"]);
	player = new Player("José", playerAnimation);
	playerView = player.getView();

	// Creating the map
	map.generateView(app.screen.width, app.screen.height);
	mapContainer = map.getView();

	// Placing player and map
	mapContainer.x = mapX;
	mapContainer.y = mapY;
	playerView.x = app.screen.width / 2;
	playerView.y = app.screen.height / 2;

	// Adding the player and map to the app
	app.stage.addChild(mapContainer);
	app.stage.addChild(playerView);

	// Setting the app's ticker for movement
	app.ticker.add(move, 150);
}

// Setting the position relatively to the map
// TODO: Getting the coords to place at from the server
mapX = 0;
mapY = 0;

// Adding Event Listeners
window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// Sets up the execution of the app's initialization after loading the resources
app.loader.onComplete.add(initApp);

// Loads all the game's resources
loadResources();
