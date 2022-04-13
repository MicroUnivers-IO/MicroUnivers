import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";
import { serverLoop } from "./loop";
import { State } from "./State";

const port = 7777;

const state = new State();

const app = uWS.App().ws('/ws', {
    // config
    compression: 0,
    maxPayloadLength: 16 * 1024 * 1024,
    idleTimeout: 60,

    open: (ws) => {
        openHandler(ws, state);
    },

    message: (ws, msg, isBinary) => {
        messageHandler(ws, msg, isBinary, state);
    },

    close: (ws, code, msg) => {
        closeHandler(ws, code, msg, state); 
    }

}).listen(port, success => {
    success ?
        console.log(`Le serveur de socket écoute sur le port : ${port}`) :
        console.log(`Erreur dans le lancement dans la socket sur le port : ${port}`);
});

// serverLoop(() => {
//     console.log("looping");
//     app.publish(PROTOCOLS.UPDATE, JSON.stringify(state.getPlayers))
// });