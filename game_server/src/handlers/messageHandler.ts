import { GAME_TEMPLATE } from "../server";
import uWS from "uWebSockets.js";

const decoder = new TextDecoder('utf-8');

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket, msg: ArrayBuffer, isBinary: boolean) {
    console.log(`Message reçu de la socket :`, ws, `Msg : ${decoder.decode(msg)}`);

    // is msg.type = DEPLACEMENT

}