import { Application, AnimatedSprite, Texture, Sprite, Loader, Spritesheet, Container } from 'pixi.js'
import { Player } from './game/player';


const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 740,
	height: 310
});

let player: Player;
let zPressed: boolean;
let sPressed: boolean;
let qPressed: boolean;
let dPressed: boolean;

function move(){
}

function handleKeypress(event: KeyboardEvent) {
	switch(event.key) {
		case "z":
		case "Z":
			zPressed = true;
			break;
		case "s":
		case "S":
			sPressed = true;
			break;
		case "q":
		case "Q":
			qPressed = true;
			break;
		case "d":
		case "D":
			dPressed = true;
			break;
	}
}

window.addEventListener("keypress", handleKeypress);
app.ticker.add(move)
app.loader.add("assets/player/player.json");
app.loader.load(setupApp);

function setupApp() {
	let playerSpriteSheet:Spritesheet = app.loader.resources["assets/player/player.json"].spritesheet;
	let playerAnimation:AnimatedSprite = new AnimatedSprite(playerSpriteSheet.animations["idle"]);
	playerAnimation.animationSpeed = 0.1;
	playerAnimation.scale.x = 2;
	playerAnimation.scale.y = 2;

	player = new Player("José", playerAnimation);
	let playerView:Container = player.getView();

	console.log("setupApp");
	app.stage.addChild(playerView);
}
