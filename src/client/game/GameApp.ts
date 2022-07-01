import { Application, Graphics, Sprite, Spritesheet, Texture } from "pixi.js";
import { Entity } from "../../lib/types/Entity";
import { MapComponent } from "../../lib/common/MapComponent";
import { Player } from "../../lib/types/Player";
import { GameEntity } from "./GameEntity";
import { GameMap } from "./GameMap";
import { GamePlayer } from "./GamePlayer";
import { GameSocket } from "./GameSocket";
import { GameState } from "./GameState";
import { Vector } from "../../lib/common/Vector";
import { QuadTree } from "../../lib/common/Quadtree";
import { MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT } from "../../lib/common/const";
import { Rect } from "../../lib/common/Rect";
import { Line } from "../../lib/common/Line";

export class GameApp {
    static app: Application;

    static map: GameMap;
    static collisionMatrix: number[][];
    static players: GamePlayer[] = [];
    static entitys: GameEntity[] = [];
    static obstacleLineQuadTree: QuadTree;

    static mainPlayer: GamePlayer;
    static state: GameState;

    static north: boolean = false;
    static south: boolean = false;
    static west: boolean = false;
    static east: boolean = false;
    static attack: boolean = false;
    static direction: string = "down";


    static init(PORT:number, URL:string, TOKEN:string | null = null) {
        GameApp.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: window,
            backgroundColor: 0x000000
        });

        GameApp.app.loader.add("playerSpritesheet", "static/assets/player/vache.json");
        GameApp.app.loader.add("tileSet", "static/assets/tileset/tileset.json");
        GameApp.app.loader.add("entitySpritesheet", "static/assets/entity/slime.json");


        GameApp.app.loader.load((loader, resources) => {
            GameSocket.init(PORT, URL, TOKEN);
            GameApp.app.ticker.add(GameApp.gameLoop);

            GameApp.app.ticker.maxFPS = 60;
        });
        GameApp.app.stage.interactive = true;
        GameApp.app.stage.on('pointermove', GameApp.updateDirectionFromMouse);
    }

    static setMainPlayer(player: Player) {
        GameApp.mainPlayer = new GamePlayer(player, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet);
        GameApp.map.addChild(GameApp.mainPlayer);
        GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
    }

    static setMap(tileMatrix: MapComponent[][]) {
        GameApp.map = new GameMap(GameApp.app.loader.resources["tileSet"].spritesheet as Spritesheet, tileMatrix);
        GameApp.app.stage.addChild(GameApp.map);
    }

    static initObstacleQuadtree(lines: Line[]){
        GameApp.obstacleLineQuadTree = new QuadTree(Number.MAX_SAFE_INTEGER, 100, new Rect(0,0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT)).clear();
        lines.forEach(l => GameApp.obstacleLineQuadTree.addItem(l.x, l.y, l));    
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

    static addPlayer(p: Player) {
        const np = new GamePlayer(p, GameApp.app.loader.resources["playerSpritesheet"].spritesheet as Spritesheet)
        GameApp.players.push(np);
        GameApp.map.addChild(np);
    }

    static addEntity(e: Entity){
        const ne = new GameEntity(e, GameApp.app.loader.resources["entitySpritesheet"].spritesheet as Spritesheet);
        GameApp.entitys.push(ne);
        GameApp.map.addChild(ne);
    }

    static render() {

        const state: any = GameState.getCurrentState();
        
        //GameApp.mainPlayer.updateMain2(GameApp.north, GameApp.south, GameApp.west, GameApp.east, GameApp.attack, state.me.x, state.me.y);
        GameApp.mainPlayer.updateMain(GameApp.north, GameApp.south, GameApp.west, GameApp.east, GameApp.attack , GameApp.direction);

        let newP;
        let identifiedPlayers: any = {};
        for (let i = 0; i < state.players.length; ++i) {
            newP = true;
            for (let j = 0; j < this.players.length; ++j) {
                if (GameApp.players[j].player.id == state.players[i].id) {
                    GameApp.players[j].updateOther(state.players[i].x, state.players[i].y, state.players[i].action);
                    newP = false;
                    identifiedPlayers[state.players[i].id] = true;
                    break;
                }
            }
            if (newP) {
                GameApp.addPlayer(state.players[i] as Player)
                identifiedPlayers[state.players[i].id] = true;
            }
            
        }

        GameApp.players.filter(p => {
            if(identifiedPlayers[p.player.id]) return true;

            GameApp.map.removeChild(p);
            p.destroy();
            return false;
        });

        let newE
        let identifiedEntities: any = {};
        for(let i = 0; i < state.entitys.length; i++){
            newE = true;
            for(let j = 0; j < GameApp.entitys.length; j++){
                if(GameApp.entitys[j].entity.id == state.entitys[i].id){
                    GameApp.entitys[j].update(state.entitys[i]);
                    newE = false;
                    identifiedEntities[state.entitys[i].id] = true;
                    break;
                }
            }

            if(newE && state.entitys[i].alive){
                GameApp.addEntity(state.entitys[i] as Entity);
                identifiedEntities[state.entitys[i].id] = true;
            } 
        }

        let deadEntities: Entity[] = [];

        GameApp.entitys = GameApp.entitys.filter(e => {
            if(e.entity.alive && identifiedEntities[e.entity.id]) return true;

            GameApp.map.removeChild(e);
            e.destroy();
            deadEntities.push(e.entity);
            return false;
        })

        GameApp.map.pivot.copyFrom(GameApp.mainPlayer.position);
        if (GameApp.attack) GameApp.attack = false;
        
        GameSocket.sendUpdate(GameApp.mainPlayer.player, deadEntities);
    }

    static updateDirectionFromMouse(e: any){
        if(!GameApp.mainPlayer) return;
        
        let mousePos = new Vector(e.data.global.x, e.data.global.y) ;

        let topLeft = new Vector(0, 0);
        let bottomLeft = new Vector(0, window.innerHeight);
        let topRight = new Vector(window.innerWidth, 0);
        let bottomRight = new Vector(window.innerWidth, window.innerHeight);
        let mid = new Vector(window.innerWidth / 2, window.innerHeight / 2);

        if(mousePos.isInTriangle(topLeft, bottomLeft, mid)) GameApp.direction = "left";
        if(mousePos.isInTriangle(topLeft, topRight, mid)) GameApp.direction = "up";
        if(mousePos.isInTriangle(topRight, bottomRight, mid)) GameApp.direction = "right";
        if(mousePos.isInTriangle(bottomRight, bottomLeft, mid)) GameApp.direction = "down";
    }
}