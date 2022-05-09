import { Player } from "../lib/types/Player";
import uWS from "uWebSockets.js";
import { workerData } from "worker_threads";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle } from "fractal-noise";

export class State{
    
    private URL: string;
    private players: any;
    private mapNoise: number[][]; 


    constructor(URL: string){
        this.URL = URL;
        this.players = {};
        this.mapNoise = makeRectangle(100, 100, makeNoise2D(), {
            octaves: 1,
            amplitude: 1.1,
            frequency: 0.06
        }) as unknown as number[][];
    }

    public addPlayer(ws: uWS.WebSocket, player: Player){
        ws.authenticated = true; // communication avec la bdd --> dans OPTIONS il y aura un JWT

        this.players[ws.id] = player;
        // si la connexion marche pas removeFromQueue(ws); stefan : "pas besoin si on utilise un dict"
    }

    public updatePlayer(ws: uWS.WebSocket, player: Player){
        this.players[ws.id] = player;
    }

    public deletePlayer(ws: uWS.WebSocket){
        delete this.players[ws.id];
    }

    public getPlayers(){
        let p = [];
        for(let key in this.players)
            p.push(this.players[key]);
        
        return p; 
    }

    public getURL(){
        return this.URL;
    }

    public getMapNoise(){
        return this.mapNoise;
    }
}