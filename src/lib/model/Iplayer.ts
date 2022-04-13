import uWS from "uWebSockets.js";

export interface Iplayer{
    socket: uWS.WebSocket;  //authenticated socket
    username: string;
    x: number;
    y: number;
}
