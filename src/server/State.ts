import { Iplayer } from "../lib/types/Iplayer";
import uWS from "uWebSockets.js";

export class State{
    private queue: uWS.WebSocket[];
    private players: Iplayer[];
    
    constructor(){
        this.queue = [];
        this.players = [];
    }

    public toQueue(ws: uWS.WebSocket){
        ws.authenticated = false;
        this.queue.push(ws);
        console.log("added to queue");

    }

    public removeFromQueue(ws: uWS.WebSocket, closeSocket: boolean){
        this.queue = this.queue.filter((val) => {return val.id != ws.id});
        if(closeSocket) ws.close();
    }

    public addPlayer(ws: uWS.WebSocket, options: any){

        const p: Iplayer ={
            socket: ws,
            username: options.username, //get from db
            x: 0, //default
            y: 0 //default
        };

        ws.authenticated = true; // communication avec la bdd --> dans OPTIONS il y aura un JWT

        this.players.push(p);
        // si la connexion marche pas removeFromQueue(ws);
    }

    public removePlayer(ws: uWS.WebSocket): void{
        this.players = this.players.filter((val) => { return val.socket.id != ws.id; });
    }

    public getPlayers(){
        return this.players;
    }
}