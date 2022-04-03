"use strict";

import uWS from "uWebSockets.js";

const port = 7777;

let SOCKETS = [];
let PLAYERS = [];

const decoder = new TextDecoder('utf-8');


let ACTIONS = Object.freeze({
  ACTIONS_MOVE: "MOVE",
  ACTIONS_UPDATE_PLAYERS: "UPDATE_PLAYERS"
});

const app = uWS.App()
  .ws('/ws', {
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
      ws.subscribe("updatePlayers");
    },

    close: (ws, code, message) => {
      // called when a ws connection is closed
    }

  }).listen(port, token => {
    token ?
      console.log(`Listening to port ${port}`) :
      console.log(`Failed to listen to port ${port}`);
  });

setInterval(() => {
  app.publish("updatePlayers", "Message.");
}, 16);