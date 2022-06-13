import uWS from "uWebSockets.js";
import { Player } from "../../lib/types/Player";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle } from "fractal-noise";
import { ServEntity } from "./ServEntity";
import { createMap, createMapComponent, MapComponent} from "../../lib/common/MapComponent";
import { MAP_HEIGTH, MAP_PIXEL_HEIGHT, MAP_PIXEL_WIDTH, MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../../lib/common/const";
import { QuadTree } from "../../lib/common/Quadtree";
import { Rect } from "../../lib/common/Rect";
import { Entity } from "../../lib/types/Entity";
import { getObstacleLines, Line } from "../../lib/common/Line";
import { Vector } from "../../lib/common/Vector";


export class State {

    URL: string;
    players: any;
    tileMatrix: MapComponent[][];
    spawnableArea: MapComponent[];
    obstacleLines: Line[];
    entitys: ServEntity[];
    entitysQuadTree: QuadTree;
    obstacleLinesQuadTree: QuadTree;

    constructor(URL: string) {
        this.URL = URL;
        this.players = {};

        this.entitysQuadTree = new QuadTree(Number.MAX_SAFE_INTEGER, 100, new Rect(0,0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT));
        this.obstacleLinesQuadTree = new QuadTree(Number.MAX_SAFE_INTEGER, 100, new Rect(0,0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT));

        this.entitysQuadTree.clear();
        this.obstacleLinesQuadTree.clear();


        let mapInfo = createMap();
        this.tileMatrix = mapInfo.matrix;
        this.spawnableArea = mapInfo.spawn

        this.obstacleLines = getObstacleLines(this.tileMatrix);

        this.obstacleLines.forEach(ol => this.obstacleLinesQuadTree.addItem(ol.x, ol.y, ol));        

        this.entitys = [];
        
        for(let i = 0; i < 200; i++){
            let coord = this._randomCoordWithinSpawningArea()
            this.entitys.push(new ServEntity(coord.x, coord.y));
        }
    }

    private _randomCoordWithinSpawningArea(){
        let randomSpawnableArea = this.spawnableArea[Math.floor(Math.random() * this.spawnableArea.length)];
        
        return new Vector(
            randomSpawnableArea.x + randomSpawnableArea.width / 2,
            randomSpawnableArea.y + randomSpawnableArea.heigth / 2
        )
    }

    addPlayer(ws: uWS.WebSocket, player: Player) {
        ws.authenticated = true; // communication avec la bdd --> dans OPTIONS il y aura un JWT
        
        let coord = this._randomCoordWithinSpawningArea();
        player.x = coord.x;
        player.y = coord.y;

        this.players[ws.id] = player;
    }

    updatePlayer(ws: uWS.WebSocket, player: Player) {
        this.players[ws.id] = player;
    }

    updateEntitys(){
        let players = this.getPlayers();
        this.entitysQuadTree.clear();
        
        this.entitys.forEach(entity => this.entitysQuadTree.addItem(entity.position.x, entity.position.y, entity));
        
        this.entitys.forEach(entity => entity.update(this.entitysQuadTree, players, this.obstacleLinesQuadTree, this));

        // this.entitys[0].update(this.entitysQuadTree, players, this.obstacleLinesQuadTree, this);
    }

    deletePlayer(ws: uWS.WebSocket) {
        delete this.players[ws.id];
    }

    getPlayers() {
        let p = [];
        for (let key in this.players)
            p.push(this.players[key]);

        return p;
    }
}