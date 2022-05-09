import { PROTOCOLS } from "../../lib/enums/protocols";
import { Player } from "../../lib/types/Player";
import { GameApp } from "./GameApp";

export class GameSocket{
    static ws: WebSocket;
    static URL: string;

    static init(URL: string){
        GameSocket.URL = URL;
        GameSocket.ws = new WebSocket("ws://127.0.0.1:7777" + GameSocket.URL);

        GameSocket.ws.onopen = () =>{
            console.log("> Socket connectée.");

            let handshakeMSG = {
                type: PROTOCOLS.CLI_HANDSHAKE
            };

            GameSocket.ws.send(JSON.stringify(handshakeMSG));
        }

        GameSocket.ws.onmessage = (receivedMSG) => {
            let msg = JSON.parse(receivedMSG.data);

            switch(msg.type){
                case PROTOCOLS.INIT_PLAYER: GameSocket.initPlayer(msg); break;
                case PROTOCOLS.UPDATE + GameSocket.URL: GameSocket.update(msg); break;
                default: console.log("unhandled message");
            }
        }

        GameSocket.ws.onclose = () =>{
            
        }
    }

    static initPlayer(msg: any){
        GameApp.setMap(msg.map);
        GameApp.setMainPlayer(msg.player as Player);
    }
    
    static update(msg: any){
        GameApp.update(msg.players as Player[]);
    }

    static sendUpdate(player: Player){
        let updateMSG = {
            type: PROTOCOLS.CLI_UPDATE,
            player: player
        }
        this.ws.send(JSON.stringify(updateMSG)); 
    }
}