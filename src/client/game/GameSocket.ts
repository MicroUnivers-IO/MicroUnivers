import { PROTOCOLS } from "../../lib/enums/protocols";
import { Player } from "../../lib/types/Player";
import { GameApp } from "./GameApp";
import { GameState } from "./GameState";

export class GameSocket {
    static ws: WebSocket;
    static SOCKET_URL: string;
    static ENDPOINT: string;
    static PORT: number;


    static init(PORT: number, ENDPOINT: string, TOKEN: string | null, SERVER_URL: string = location.hostname) {
        
        // trycatch pour le dev sinon toujours HTTPS en production
        try {
            this.ENDPOINT = ENDPOINT;
            this.PORT = PORT;
            GameSocket.SOCKET_URL = `${(location.protocol == 'https:' ? 'wss' : 'ws')}://${SERVER_URL}:${PORT}${ENDPOINT}`;
        } catch (e) {
            GameSocket.SOCKET_URL = `ws://microunivers.io:${PORT}/${ENDPOINT}`;
            console.log("🕷 Problem while defining socket url, using : " + GameSocket.SOCKET_URL);
        }

        GameSocket.ws = new WebSocket(GameSocket.SOCKET_URL);

        GameSocket.ws.onopen = () => {
            let handshakeMSG = { 
                type: PROTOCOLS.CLI_HANDSHAKE,
                token: TOKEN
            };

            GameSocket.ws.send(JSON.stringify(handshakeMSG));
            console.log(`🔌 Socket connected : ${GameSocket.SOCKET_URL}`);

        }

        GameSocket.ws.onmessage = (receivedMSG) => {
            let msg = JSON.parse(receivedMSG.data);
            switch (msg.type) {
                case PROTOCOLS.INIT_PLAYER: GameSocket.initGame(msg); break;
                case PROTOCOLS.INPUTS_ACK: console.log(msg);
                case PROTOCOLS.UPDATE + GameSocket.ENDPOINT: GameState.processGameUpdate(msg); break;
                case PROTOCOLS.CONN_ERROR: GameSocket.connError(msg); break;
                default: console.log(`❌ Unhandled message type : ${msg.type}`);
            }
        }

        GameSocket.ws.onclose = () => {
            console.log(`🔍 Connexion lost with the server, try to reload...`);
            //location.reload();
        }

    }


    static initGame(msg: any) {
        GameApp.setMap(msg.map);
        GameApp.setMainPlayer(msg.player as Player);
        GameApp.initObstacleQuadtree(msg.obstacle);
    }

    static connError(msg: any) {
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
        alert(msg.error);
    }

    static sendUpdate(player: Player) {
        let updateMSG = {
            type: PROTOCOLS.CLI_UPDATE,
            player: player
        }
        this.ws.send(JSON.stringify(updateMSG));
    }


}