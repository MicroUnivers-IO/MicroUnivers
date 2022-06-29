import uWS from "uWebSockets.js";
import { Player } from "../../lib/types/Player";
import { ServEntity } from "./ServEntity";
import { createMap, getLimitLines, MapComponent} from "../../lib/common/MapComponent";
import { MAP_PIXEL_HEIGHT, MAP_PIXEL_WIDTH} from "../../lib/common/const";
import { QuadTree } from "../../lib/common/Quadtree";
import { Rect } from "../../lib/common/Rect";
import { getObstacleLines, Line } from "../../lib/common/Line";
import { Vector } from "../../lib/common/Vector";
import { LobbyOpts } from "./Lobby";


export class State {

    lobbyOpts: LobbyOpts;
    URL: string;
    guestLobby: boolean;
    players: any;
    tileMatrix: MapComponent[][];
    spawnableArea: MapComponent[];
    obstacleLines: Line[];
    entitys: ServEntity[];
    entitysQuadTree: QuadTree;
    obstacleLinesQuadTree: QuadTree;

    constructor(opts: LobbyOpts) {
        this.lobbyOpts = opts;
        this.URL = opts.url;
        this.guestLobby = opts.guestLobby;
        this.players = {};

        this.entitysQuadTree = new QuadTree(Number.MAX_SAFE_INTEGER, 100, new Rect(0,0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT)).clear();
        this.obstacleLinesQuadTree = new QuadTree(Number.MAX_SAFE_INTEGER, 100, new Rect(0,0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT)).clear();
        
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


    /*
    Vérifier qu'un joueur n'est pas déjà connecté avec le même pseudo !!!!!!
    */
    addPlayer(ws: uWS.WebSocket, player: Player) {
        ws.authenticated = true; // communication avec la bdd --> dans OPTIONS il y aura un JWT
        
        console.log(this.players);
        
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
        
        this.entitys.forEach(entity => this.entitysQuadTree.addItem(entity.position.x, entity.position.y, entity)); //updating the quadtree
        this.entitys.forEach(entity => entity.update(this.entitysQuadTree, players, this.obstacleLinesQuadTree));
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