import uWS from "uWebSockets.js";
import Lobby from "../../model/lobby";

export default function (lobby: Lobby, ws: uWS.WebSocket, code: number, msg: ArrayBuffer) {
    console.log('Cette socket s\'est deconnectée...', ws);
}