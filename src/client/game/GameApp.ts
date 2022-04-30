import { Application, Spritesheet } from "pixi.js";
import { Player } from "../../lib/types/Player";
import { GameMap } from "./GameMap";
import { GamePlayer } from "./GamePlayer";
import { GameSocket } from "./GameSocket";

export class GameApp{
    private static app: Application;

    static map: GameMap;
    static players: GamePlayer[] = [];
    static mainPlayer: GamePlayer;

    static north: boolean = false;
    static south: boolean = false;
    static west: boolean  = false;
    static east: boolean  = false;
    static attack: boolean = false;

    static init(URL: string){
        GameApp.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: window,
            backgroundColor: 0x000000
        });

        GameApp.app.loader.add("playerSpritesheet", "assets/player/sheet.json");
        GameApp.app.loader.add("assets/tileset/field_01.png");

        GameApp.app.loader.load((loader, resources) => {
            GameApp.map = new GameMap();
            GameApp.app.stage.addChild(GameApp.map);
            GameSocket.init(URL);
            GameApp.app.ticker.add(GameApp.gameLoop);
        });
        
    }

    static setMainPlayer(player: Player){
        GameApp.mainPlayer = new GamePlayer(player, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet);
        GameApp.map.addChild(GameApp.mainPlayer);
        GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
    }

    static resizeHandler(): void {
        GameApp.app.renderer.resize(window.innerWidth, window.innerHeight);

        if(GameApp.map) GameApp.map.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    }

    static keyPressHandler(event: KeyboardEvent, pressed: boolean){
        if(!GameApp.mainPlayer) return;

        switch(event.key){
            case "w": GameApp.north = pressed; break;
            case "a": GameApp.west = pressed; break;
            case "s": GameApp.south = pressed; break;
            case "d": GameApp.east = pressed; break;
        }
    }

    static mouseClickHandler(event: MouseEvent){
        GameApp.attack = true;
    }

    static gameLoop(){
        if(GameApp.mainPlayer){
            GameApp.mainPlayer.updateMain(GameApp.north, GameApp.south, GameApp.west, GameApp.east, GameApp.attack);
            if(GameApp.attack) GameApp.attack = false;
            GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
            GameSocket.sendUpdate(GameApp.mainPlayer.player);
        } 
        
        GameApp.players.forEach(p => p.updateOther());
    }

    static update(players: Player[]){
        let state: any = {};

        for(let i = 0; i < players.length; i++){
            
            if(players[i].id === GameApp.mainPlayer.player.id){              
                GameApp.mainPlayer.player = players[i];
                continue;
            }

            let identified = false;

            for(let y = 0; y < GameApp.players.length; y++){
                if(players[i].id === GameApp.players[y].player.id){
                    GameApp.players[y].player = players[i];
                    state[GameApp.players[y].player.id] = true;
                    identified = true;
                    break;
                }
            }

            //not identified -> create new player (freshly connected)
            if(!identified){                
                let newPlayer = new GamePlayer(players[i], GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet)
                GameApp.players.push(newPlayer);
                GameApp.map.addChild(newPlayer);
                state[players[i].id] = true;
            }
            
        }

        //clear players list (dead / deconnected etc...)
        GameApp.players = GameApp.players.filter(p => {            
            if(!state[p.player.id]){
                GameApp.map.removeChild(p);
                p.destroy();
                return false;
            }
            return true;
        });
    }
}