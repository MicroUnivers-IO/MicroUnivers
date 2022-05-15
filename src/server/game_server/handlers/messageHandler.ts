import uWS from "uWebSockets.js";
import { randomUUID } from "crypto";
import { PROTOCOLS } from "../../../lib/enums/protocols";
import { Player } from "../../../lib/types/Player";
import { State } from "../State";

const decoder = new TextDecoder('utf-8');
let number = 0;

export const messageHandler = (ws: uWS.WebSocket, msg: ArrayBuffer, isBinary: boolean, state: State) => {
    let receivedMSG;
    
    try { receivedMSG = JSON.parse(decoder.decode(msg)); } 
    catch (e) { return console.log("unparsable msg : " + e); }

    if(!receivedMSG.type) return console.log("no type properties defined");

    switch(receivedMSG.type){
        case PROTOCOLS.CLI_HANDSHAKE:
            console.log("Client Handshake !");
            onHandshake(ws, receivedMSG, state);
            break;
        case PROTOCOLS.CLI_UPDATE:
            onUpdate(ws, receivedMSG, state);
            break;
        default:
            return console.log("received message can be handled");
    }
};


function onHandshake(ws: uWS.WebSocket, msg: any, state: State){
    const p: Player = {
        socket: ws,
        id: randomUUID(), //tracker dont mind
        username: "José_" + number++, //get from db
        x: 1500, 
        y: 1500,
        speed: 5,
        action: "idle_down",
    };

    state.addPlayer(ws, p);

    let initMSG = {
        type: PROTOCOLS.INIT_PLAYER,
        player: p,
        map: state.mapNoise
    }

    ws.send(JSON.stringify(initMSG));
    ws.subscribe(PROTOCOLS.UPDATE + state.URL);
}

function onUpdate(ws: uWS.WebSocket, msg: any, state: State){
    if(!ws.authenticated) return console.log("unauthenticated user can't update");
    if(!msg.player) return console.log("no player properties defined");

    let updatedPlayer: Player = msg.player;
    state.updatePlayer(ws, updatedPlayer);
}