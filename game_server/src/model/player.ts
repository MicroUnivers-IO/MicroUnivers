import uWS from "uWebSockets.js";

interface Player{
    socket: uWS.WebSocket;  //authenticated socket
    username: string;
    x: number;
    y: number;
}

export default Player;