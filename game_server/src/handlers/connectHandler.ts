import { GAME_TEMPLATE } from "../server";
import uWS from "uWebSockets.js";

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket) {
    game.UNAUTHENTICATED_SOCKETS.push(ws)
    console.log("Une socket s'est connectée.");
}
