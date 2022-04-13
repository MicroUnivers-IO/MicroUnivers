import uWS from "uWebSockets.js";
import { Lobby } from "../server";


export const closeHandler = (lobby: Lobby, ws: uWS.WebSocket, code: number, msg: ArrayBuffer) => {
    console.log("sockets closed");
};
