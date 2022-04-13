import uWS from "uWebSockets.js";
import { State } from "../State";


export const closeHandler = (ws: uWS.WebSocket, code: number, msg: ArrayBuffer, state: State) => {
    if(ws.authenticated) state.removePlayer(ws);
    console.log("sockets closed : " + ws.id);
};
