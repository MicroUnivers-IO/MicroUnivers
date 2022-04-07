import { GAME_TEMPLATE } from "../server";
import uWS from "uWebSockets.js";

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket) {
    ws.name = "Gnérer nom";
    game.SOCKETS.push(ws);
    console.log(game);
    console.log("Une socket s'est connectée.");
}
