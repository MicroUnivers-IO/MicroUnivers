import { Application, Spritesheet } from "pixi.js";
import { Player } from "../../lib/types/Player";
import { GameMap } from "./GameMap";
import { GamePlayer } from "./GamePlayer";
import { GameSocket } from "./GameSocket";
import { GameState } from "./GameState";

export class GameApp {
    private static app: Application;

    public static map: GameMap;
    public static players: GamePlayer[] = [];
    public static mainPlayer: GamePlayer;
    public static state: GameState;

    static north: boolean = false;
    static south: boolean = false;
    static west: boolean = false;
    static east: boolean = false;
    static attack: boolean = false;
    static x = document.getElementById("x");
    static y = document.getElementById("y");

    static init(PORT:number, URL:string) {
        GameApp.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: window,
            backgroundColor: 0x000000
        });

        GameApp.app.loader.add("playerSpritesheet", "assets/player/sheet.json");
        GameApp.app.loader.add("tileSet", "assets/tileset/texture.json");


        GameApp.app.loader.load((loader, resources) => {
            GameSocket.init(PORT, URL);
            GameApp.app.ticker.add(GameApp.gameLoop);
        });
        
    }

    static setMainPlayer(player: Player) {
        GameApp.mainPlayer = new GamePlayer(player, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet);
        GameApp.map.addChild(GameApp.mainPlayer);
        GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
    }

    static setMap(mapNoise: number[][]) {
        GameApp.map = new GameMap(GameApp.app.loader.resources["tileSet"].spritesheet as Spritesheet, mapNoise);
        GameApp.app.stage.addChild(GameApp.map);
    }

    static resizeHandler(): void {
        GameApp.app.renderer.resize(window.innerWidth, window.innerHeight);

        if (GameApp.map) GameApp.map.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    }

    static keyPressHandler(event: KeyboardEvent, pressed: boolean) {
        if (!GameApp.mainPlayer) return;

        switch (event.key) {
            case "w": GameApp.north = pressed; break;
            case "a": GameApp.west = pressed; break;
            case "s": GameApp.south = pressed; break;
            case "d": GameApp.east = pressed; break;
        }
    }

    static mouseClickHandler(event: MouseEvent) {
        GameApp.attack = true;
    }

    static gameLoop() {
        if (GameApp.mainPlayer && GameApp.map) GameApp.render();
    }

    static addPlayer(p: Player, sp: Spritesheet) {
        const np = new GamePlayer(p, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet)
        GameApp.players.push(np);
        GameApp.map.addChild(np);
    }

    static render() {

        const state: any = GameState.getCurrentState();
        
        //GameApp.mainPlayer.updateMain2(GameApp.north, GameApp.south, GameApp.west, GameApp.east, GameApp.attack, state.me.x, state.me.y);
        GameApp.mainPlayer.updateMain(GameApp.north, GameApp.south, GameApp.west, GameApp.east, GameApp.attack);

        let newP;
        for (let i = 0; i < state.players.length; ++i) {
            newP = true;
            for (let j = 0; j < this.players.length; ++j) {
                if (GameApp.players[j].player.id == state.players[i].id) {
                    GameApp.players[j].updateOther(state.players[i].x, state.players[i].y, state.players[i].action);
                    newP = false;
                    break;
                }
            }
            if (newP) {
                GameApp.addPlayer(state.players[i] as Player, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet)
            }
            
        }

        GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
        if (GameApp.attack) GameApp.attack = false;

        GameSocket.sendUpdate(GameApp.mainPlayer.player);
    }
}