"use strict";

import uWS from "uWebSockets.js";
import { serverLoop } from "./loop";

const port = 7777;

let SOCKETS = [];
let PLAYERS = [];

const decoder = new TextDecoder('utf-8');

console.time("temps");

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

  var aVerySlowFunction = function(milliseconds: number) {
    // waste time
    var start = Date.now()
    while (Date.now() < start.valueOf() + milliseconds) { }
    console.log("fini.")
  }
  
let nbTime = 0;
function updateGame() {
  nbTime++;
  
  aVerySlowFunction(1);
  console.log("testing");

  if(nbTime == 200) {
      console.timeEnd("temps");
      process.exit(1);
  }
}

serverLoop(updateGame);