import uWS, { us_listen_socket_close } from "uWebSockets.js";
import { Iplayer } from "../lib/model/Iplayer";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";


export class Lobby{
    private readonly port = 7777;
    private app: uWS.TemplatedApp;

    private queue: uWS.WebSocket[] ;
    private players: Iplayer[];

    constructor(){
        this.queue = [];
        this.players = [];
        
        this.app = uWS.App().ws('/ws', {
            // config
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 60,
        
            open: (ws) => {
                openHandler(this, ws);
            },
        
            message: (ws, msg, isBinary) => {
                messageHandler(this, ws, msg, isBinary);
            },
        
            close: (ws, code, msg) => {
                closeHandler(this, ws, code, msg); 
            }
        
        }).listen(this.port, success => {
            success ?
                console.log(`Le serveur de socket écoute sur le port : ${this.port}`) :
                console.log(`Erreur dans le lancement dans la socket sur le port : ${this.port}`);
        });
    }

    public toQueue(ws: uWS.WebSocket){
        this.queue.push(ws);
    }

    public removeFromQueue(ws: uWS.WebSocket){
        this.queue.filter((val, i, arr) => {return val.id != ws.id});
    }

    public addPlayer(ws: uWS.WebSocket){
        let p: Iplayer ={
            socket: ws,
            username: "jose", //get from db
            x: 0, //default
            y: 0 //default
        };

        this.players.push(p);
    }

    public removePlayer(ws: uWS.WebSocket): void{
        this.players.filter((val, i, arr) => {return val.socket.id != ws.id;});
    }

    public closeLobby(){
        us_listen_socket_close(this.app);
    }

}

const lobby = new Lobby();