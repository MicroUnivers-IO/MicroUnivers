import uWS from "uWebSockets.js";
import { Lobby } from "../server";


export const messageHandler = (lobby: Lobby, ws: uWS.WebSocket, msg: ArrayBuffer, isBinary: boolean) => {
    console.log("message received");
};
