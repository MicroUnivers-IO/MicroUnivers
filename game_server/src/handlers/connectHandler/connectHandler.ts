import uWS from "uWebSockets.js";
import Lobby from "../../model/lobby";

export default function (lobby: Lobby, ws: uWS.WebSocket) {
    lobby.toQueue(ws);
    console.log("Une socket s'est connectée.");
}
