import { Iplayer } from "../lib/model/Iplayer";
import uWS from "uWebSockets.js";

export class State{
    private queue: uWS.WebSocket[];
    private players: Iplayer[];
    
    constructor(){
        this.queue = [];
        this. players = [];
    }

    public toQueue(ws: uWS.WebSocket){
        ws.authenticated = false;
        this.queue.push(ws);
        console.log("added to queue");

    }

    public removeFromQueue(ws: uWS.WebSocket){
        this.queue.filter((val, i, arr) => {return val.id != ws.id});
        console.log("removed from queue");
    }

    public addPlayer(ws: uWS.WebSocket, id: number){
        let p: Iplayer ={
            socket: ws,
            username: "jose", //get from db
            x: 0, //default
            y: 0 //default
        };

        ws.authenticated = true;

        this.players.push(p);
        console.log("added player");
    }

    public removePlayer(ws: uWS.WebSocket): void{
        this.players.filter((val, i, arr) => {return val.socket.id != ws.id;});
    }

    public getPlayers(){
        return this.players;
    }
}