import { Application, AnimatedSprite, Texture, Sprite, Loader, Spritesheet, Container } from 'pixi.js'
import { GameMap } from './game/map';
import { Player } from './game/player';

// Creating the game app
const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: window.innerWidth,
	height: window.innerHeight,
});

// Player related data
let player: Player;
let playerSpriteSheet:Spritesheet
let playerAnimation:AnimatedSprite
let playerView: Container;
let playerXpos: number;
let playerYpos: number;

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
function resizeHandler(): void {
	app.stage.removeChildren();
	app.renderer.resize(window.innerWidth, window.innerHeight);
    initApp();
}

//TODO: Needs to be fixed : The player's speed changes from a computer to another. (Does it?)
//TODO: Needs to be fixed : The player's speed changes after resize (related to above?).
/**
 * Moves the player according to the key pressed.
 * 
 * The player isn't directly moving. Its view is changing by moving the map's position.
 * The player stays centered on screen.
 */
function move(): void {
	if(!zPressed && !sPressed && !qPressed && !dPressed)
		return;

	let movementVector: number[] = [0, 0];
	
	if(zPressed) {
		movementVector[1] += 1;
	}
	if(sPressed) {
		movementVector[1] -= 1;
	}
	if(qPressed) {
		movementVector[0] += 1;
	}
	if(dPressed) {
		movementVector[0] -= 1;
	}

	let movementMagnitude:number = Math.sqrt(movementVector[0] * movementVector[0] + movementVector[1] * movementVector[1]);
	movementVector = [(movementVector[0] / movementMagnitude) * player.getSpeed(),
					 (movementVector[1] / movementMagnitude) * player.getSpeed()];

	mapContainer.position.x += movementVector[0];
	mapContainer.position.y += movementVector[1];
	playerXpos += movementVector[0];
	playerYpos += movementVector[1];
	mapX = mapContainer.x;
	mapY = mapContainer.y;
}

//TODO: Needs to be fixed : The reverse effect moves the player.
//TEMPORARY fix: changed Sprite position on reverse in player.changeAnimation()
/**
 * Manages the player's walking animation.
 * 
 * Activates the walking animation if the player is not already walking.
 * Deactivates it if he stops moving.
 * 
 * @param activateWalk Whether to start or stop walking
 * @param reverse Whether to reverse the direction of the animation
 */
function manageWalk(activateWalk: boolean, reverse: boolean = false): void {
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
function handleKeydown(event: KeyboardEvent): void {
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
function handleKeyup(event: KeyboardEvent): void {
	switch(event.key) {
		case "z":
		case "Z":
			if(!sPressed && !qPressed && !dPressed) {
				manageWalk(false);
			}
			zPressed = false;
			break;
		case "s":
		case "S":
			if(!zPressed && !qPressed && !dPressed) {
				manageWalk(false);
			}
			sPressed = false;
			break;
		case "q":
		case "Q":
			if(!zPressed && !sPressed && !dPressed) {
				manageWalk(false);
			}
			qPressed = false;
			break;
		case "d":
		case "D":
			if(!zPressed && !sPressed && !qPressed) {
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
 * Also adds all the tiles png to the app's loader.
 */
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

/**
 * Initializes the app.
 * 
 * Creates the player and map objects, places them and adds them to the app.
 * Also adds the game's ticker for movements.
 */
function initApp():void {
	// Creating the player
	playerSpriteSheet = app.loader.resources["playerSpritesheet"].spritesheet;
	playerAnimation = new AnimatedSprite(playerSpriteSheet.animations["idle"]);
	player = new Player("José", playerAnimation);
	playerView = player.getView();

	// Creating the map
	map = new GameMap();
	map.generateView(app.screen.width, app.screen.height);
	mapContainer = map.getView();

	// Placing player and map
	playerView.x = window.innerWidth / 2;
	playerView.y = window.innerHeight / 2;
	mapContainer.x = mapX;
	mapContainer.y = mapY;

	// Adding the player and map to the app
	app.stage.addChild(mapContainer);
	app.stage.addChild(playerView);

	// Setting the app's ticker for movement
	app.ticker.add(move, 150);
}

// Sets the position of the player and places the map accordingly
// TODO: Getting the coords to place at from the server
playerXpos = 500;
playerYpos = 500;
mapX = playerXpos - window.innerWidth / 2;
mapY = playerYpos - window.innerHeight / 2;

// Adding Event Listeners
window.addEventListener("resize", resizeHandler);
window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

// Sets up the execution of the app's initialization after loading the resources
app.loader.onComplete.add(initApp);

// Loads all the game's resources
loadResources();
