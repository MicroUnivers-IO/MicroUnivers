"use strict";

import uWS from "uWebSockets.js";
import { serverLoop } from "./loop";

const port = 7777;

let SOCKETS = [];
let PLAYERS = [];
let ENTITIES = [];
let GAME_EVENTS = [];

const decoder = new TextDecoder('utf-8');


const app = uWS.App().ws('/ws', {
    // config
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    open: (ws) => {
        SOCKETS.push(ws);
    },

    message: (ws, msg, isBinary) => {
        msg = JSON.parse(decoder.decode(msg));
        console.log(msg);
                
    },

    close: (ws, code, message) => {
        // called when a ws connection is closed
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


