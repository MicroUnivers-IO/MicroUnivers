import uWS from "uWebSockets.js";
import { Player } from "../../lib/types/Player";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle } from "fractal-noise";
import { ServEntity } from "./ServEntity";
import { isObstacle } from "../../lib/common/condition";
import { Grid } from "pathfinding";
import { Entity } from "../../lib/types/Entity";

export class State {

    public URL: string;
    public players: any;
    public mapNoise: number[][];
    public collisionMatrix: number[][]
    public entitys: ServEntity[];


    constructor(URL: string) {
        this.URL = URL;
        this.players = {};
        this.mapNoise = makeRectangle(100, 100, makeNoise2D(), {
            octaves: 1,
            amplitude: 1.2,
            frequency: 0.02
        }) as unknown as number[][];

        this.collisionMatrix = [];

        for(let row = 0; row < 100; row++){
            this.collisionMatrix[row] = []
            for(let col = 0; col < 100; col++){
                let noiseValue = this.mapNoise[row][col];
                this.collisionMatrix[row][col] = isObstacle(noiseValue) ? 1 : 0; 
            }
        }

        ServEntity.matrix = this.collisionMatrix;

        this.entitys = [];
        
        for(let i = 0; i < 400; i++){
            this.entitys.push(new ServEntity(Math.random() * 3200, Math.random() * 3200));
        }
        
    }

    public addPlayer(ws: uWS.WebSocket, player: Player) {
        ws.authenticated = true; // communication avec la bdd --> dans OPTIONS il y aura un JWT
        this.players[ws.id] = player;
    }

    public updatePlayer(ws: uWS.WebSocket, player: Player) {
        this.players[ws.id] = player;
    }

    public updateEntitys(){
        let playersArr = this.getPlayers();
        this.entitys.forEach(entity => entity.update(this.entitys, playersArr));
    }

    public deletePlayer(ws: uWS.WebSocket) {
        delete this.players[ws.id];
    }

    public getPlayers() {
        let p = [];
        for (let key in this.players)
            p.push(this.players[key]);

        return p;
    }
}