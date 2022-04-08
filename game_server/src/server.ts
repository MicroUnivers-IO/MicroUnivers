"use strict";

import uWS from "uWebSockets.js";
import { serverLoop } from "./loop";
import messageHandler from "./handlers/messageHandler/messageHandler";
import connectHandler from "./handlers/connectHandler/connectHandler";
import closeHandler from "./handlers/closeHandler/closeHandler";
import Lobby from "./model/lobby";

const port = 7777;

const lobby = new Lobby();

const app = uWS.App().ws('/ws', {
    // config
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    open: (ws) => {
        connectHandler(lobby, ws);
    },

    message: (ws, msg, isBinary) => {
      messageHandler(lobby, ws, msg, isBinary);
    },

    close: (ws, code, msg) => {
        closeHandler(lobby, ws, code, msg);
    }

}).listen(port, success => {
    success ?
        console.log(`Le serveur de socket écoute sur le port : ${port}`) :
        console.log(`Erreur dans le lancement dans la socket sur le port : ${port}`);
});


function updateGame() {
    //updatePlayers();
    //updateGameEvents();
    //updateEntities();
}

serverLoop(updateGame);

