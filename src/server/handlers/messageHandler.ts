import uWS from "uWebSockets.js";
import { PLAYER_EVENTS } from "../../lib/enums/player_events";
import { PROTOCOLS } from "../../lib/enums/protocols";
import { Lobby } from "../Lobby";

const decoder = new TextDecoder('utf-8');

export const messageHandler = (ws: uWS.WebSocket, msg: ArrayBuffer, isBinary: boolean, lobby: Lobby) => {
    console.log(ws.id + " : message received : " + decoder.decode(msg));


    let receivedMSG;
    
    try { receivedMSG = JSON.parse(decoder.decode(msg)); } 
    catch (e) { return console.log("unparsable msg : " + e); }

    if(!receivedMSG.type) return console.log("no type properties defined");

    switch(receivedMSG.type){
        case PROTOCOLS.CLI_HANDSHAKE:
            console.log("Client Handshake !");
            onHandshake(ws, receivedMSG, lobby);
            break;
        case PROTOCOLS.CLI_UPDATE:
            console.log("Client Update !");
            onUpdate(ws, receivedMSG, lobby);
            break;
        default:
            return console.log("received message can be handled");
    }
};


function onHandshake(ws: uWS.WebSocket, msg: any, lobby: Lobby){
    lobby.getState().removeFromQueue(ws, false);
    lobby.getState().addPlayer(ws, { name: msg.name });

    ws.subscribe(PROTOCOLS.UPDATE + lobby.getUrl());
}

function onUpdate(ws: uWS.WebSocket, msg: any, lobby: Lobby){
    if(!ws.authenticated) return console.log("unauthenticated user can't update");
    if(!msg.event) return console.log("no event properties defined");

    switch(msg.event){
        case PLAYER_EVENTS.MOVE_EAST:
            console.log("player want to move east !", ws);
            break;
        case PLAYER_EVENTS.MOVE_NORTH:
            console.log("player want to move north !");
            break;
        case PLAYER_EVENTS.MOVE_SOUTH:
            console.log("player want to move south !");
            break;
        case PLAYER_EVENTS.MOVE_WEST:
            console.log("player want to move west !");
            break;
        case PLAYER_EVENTS.ATTACK:
            console.log("player want to attack !");
            break;
        default:
            return console.log("received message can be handled");
    }

}