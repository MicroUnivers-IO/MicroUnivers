import uWS from "uWebSockets.js";
import Player from "./player";


class Lobby{
    
    private queue: uWS.WebSocket[] ;
    private players: Player[];

    constructor(){
        this.queue = [];
        this.players = [];
    }

    toQueue(ws: uWS.WebSocket){
        this.queue.push(ws);

        setTimeout(() =>{
            this.removeFromQueue(ws);
            ws.close;
        }, 1000);
    }

    removeFromQueue(ws: uWS.WebSocket){
        this.queue.filter((val, i, arr) => {return val.uid != ws.uid;});
    }

    authenticate(ws: uWS.WebSocket){
        this.removeFromQueue(ws);

        let p: Player ={
            socket: ws,
            username: "jose", //get from db
            x: 0, //default
            y: 0 //default
        };

        this.players.push(p);
    }
        
    removePlayer(p: Player): void{
        this.players.filter((val, i, arr) => {return val.socket.uid != p.socket.uid;});
        p.socket.close();
    }

    getQueue(){
        return this.queue;
    }

    getPlayers(){
        return this.players;
    }

}

export default Lobby;