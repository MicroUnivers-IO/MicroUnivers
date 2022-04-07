import { GAME_TEMPLATE } from "../server";
import { EVENTS } from "../config/enums";
import uWS from "uWebSockets.js";

const decoder = new TextDecoder('utf-8');

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket, msgBuffer: ArrayBuffer, isBinary: boolean) {
    let msg = JSON.parse(decoder.decode(msgBuffer));
    // console.log(`Message reçu de la socket :`, ws, `Msg : ${msg}`);

    // is msg.type = DEPLACEMENT
    if (msg.type == undefined) return console.log('Type de message inconnu.');

    switch (msg?.type) {
        case EVENTS.CLI_CONNECTED:
            console.log("Client Connected !");
            break;
        case EVENTS.CLI_HANDSHAKE:
            console.log("Client Handshake !");
            break;
        case EVENTS.CLI_UPDATE:
            console.log("Client Update !");
            break;
        default:
            return console.log('Type de message inconnu.');
            break;
    }
    


}