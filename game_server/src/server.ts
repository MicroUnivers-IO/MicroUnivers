"use strict";

import uWS from "uWebSockets.js";
import { serverLoop } from "./loop";
import messageHandler from "./handlers/messageHandler";
import connectHandler from "./handlers/connectHandler";
import closeHandler from "./handlers/closeHandler";

const port = 7777;

export type GAME_TEMPLATE = {
    SOCKETS:  uWS.WebSocket | uWS.WebSocket[];
    PLAYERS: [];
    ENTITIES: [];
    GAME_EVENTS: [];
}

const GAME: GAME_TEMPLATE = {
    SOCKETS: [],
    PLAYERS: [],
    ENTITIES: [],
    GAME_EVENTS: []
};


const app = uWS.App().ws('/ws', {
    // config
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    open: (ws) => {
        connectHandler(GAME, ws);
    },

    message: (ws, msg, isBinary) => {
      messageHandler(GAME, ws, msg, isBinary);
    },

    close: (ws, code, msg) => {
        closeHandler(GAME, ws, code, msg);
    }

}).listen(port, token => {
    token ?
        console.log(`Le serveur de socket écoute sur le port : ${port}`) :
        console.log(`Erreur dans le lancement dans la socket sur le port : ${port}`);
});


function updateGame() {
    //updatePlayers();
    //updateGameEvents();
    //updateEntities();
}

serverLoop(updateGame);

