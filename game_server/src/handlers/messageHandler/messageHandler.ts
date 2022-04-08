import { PROTOCOLS } from "../../../../lib/enums/protocols";
import uWS from "uWebSockets.js";
import Lobby from "../../model/lobby";

const decoder = new TextDecoder('utf-8');

export default function (lobby: Lobby, ws: uWS.WebSocket, msgBuffer: ArrayBuffer, isBinary: boolean) {
    let msg;
    try {
        msg = JSON.parse(decoder.decode(msgBuffer));
    } catch (e) {
        msg = undefined;
    }
    console.log("SOCKET : ", ws);
    
    if (msg?.type == undefined) return console.log('Message non défini.');

    switch (msg?.type) {
        case PROTOCOLS.CLI_CONNECTED:
            console.log("Client Connected !");
            break;
        case PROTOCOLS.CLI_HANDSHAKE:
            CLI_HANDSHAKE_handler(lobby, ws, msg);
            console.log("Client Handshake !");
            break;
        case PROTOCOLS.CLI_UPDATE:
            console.log("Client Update !");
            break;
        default:
            return console.log('Type de message inconnu.');
    }
    


}

function CLI_HANDSHAKE_handler(lobby: Lobby, ws:uWS.WebSocket, msg: string) {
    // récupération de l'id utilisateur (étape future : JWT avec l'user ID)

    // Va chercher les infos joueurs dans la BDD

    // Met la WS dans GAME.SOCKETS (la vire de GAME.UNAUTHENTICATED_SOCKETS)

    // ws.userId = userId

    // ws.subscribe à tous les topics

}
