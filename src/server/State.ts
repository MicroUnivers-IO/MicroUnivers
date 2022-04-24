import { Player } from "../lib/types/Player";
import uWS from "uWebSockets.js";
import { workerData } from "worker_threads";

export class State{
    
    private URL: string;
    private players: any;
    
    constructor(URL: string){
        this.URL = URL;
        this.players = {};
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
        for(let key in this.players){

            p.push(this.players[key]);
        }
        return p;
    }

    public getURL(){
        return this.URL;
    }
}