import uWS from "uWebSockets.js";
import { State } from "../State";


export const closeHandler = (ws: uWS.WebSocket, code: number, msg: ArrayBuffer, state: State) => {
    console.log("sockets closed : " + ws.id);
    state.deletePlayer(ws);
};
