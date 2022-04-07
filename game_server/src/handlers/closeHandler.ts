import { GAME_TEMPLATE } from "../server";
import uWS from "uWebSockets.js";

export default function (game: GAME_TEMPLATE, ws: uWS.WebSocket, code: number, msg: ArrayBuffer) {
    console.log('Cette socket s\'est deconnectée...', ws);
}