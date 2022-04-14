import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";
import { Lobby } from "./lobby";
import { serverLoop } from "./loop";
import { State } from "./State";

const port = 7777;

const lobbies: Lobby[] = [];

const app = uWS.App().listen(port, success => {
    success ?
        console.log(`Le serveur de socket écoute sur le port : ${port}`) :
        console.log(`Erreur dans le lancement dans la socket sur le port : ${port}`);
});

lobbies.push(new Lobby(app, "/dev"));