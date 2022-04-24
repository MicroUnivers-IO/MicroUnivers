import uWS from "uWebSockets.js";

export interface Player{
    socket: uWS.WebSocket | any;  //authenticated socket
    id: string;
    username: string;
    x: number;
    y: number;
    speed: number;
}
