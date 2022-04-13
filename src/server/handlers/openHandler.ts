import uWS from "uWebSockets.js";
import { Lobby } from "../server";


export const openHandler = (lobby: Lobby, ws: uWS.WebSocket) => {
    console.log("sockets oppened");
};
