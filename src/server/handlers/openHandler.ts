import { randomUUID } from "crypto";
import uWS from "uWebSockets.js";
import { State } from "../State";


export const openHandler = (ws: uWS.WebSocket, state: State) => {
    console.log("socket oppened");
    ws.id = randomUUID(); 
    state.toQueue(ws);
};
