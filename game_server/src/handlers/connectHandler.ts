import { GAME_TEMPLATE } from "../server";
import { nanoid } from "nanoid";
import uWS from "uWebSockets.js";

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket) {
    ws.uid = nanoid();
    game.SOCKETS.push(ws);
    console.log(game);
    console.log("Une socket s'est connectée.");
}
