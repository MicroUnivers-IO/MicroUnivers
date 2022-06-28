import uWS from "uWebSockets.js";
import { randomUUID } from "crypto";
import { PROTOCOLS } from "../../../lib/enums/protocols";
import { Player } from "../../../lib/types/Player";
import { State } from "../State";
import { decrypt } from "../../../lib/crypt";
import { getUser } from "../../models/User";

const decoder = new TextDecoder('utf-8');
let number = 0;

export const messageHandler = (ws: uWS.WebSocket, msg: ArrayBuffer, isBinary: boolean, state: State) => {
    let receivedMSG;

    try { receivedMSG = JSON.parse(decoder.decode(msg)); }
    catch (e) { return console.log("unparsable msg : " + e); }

    if (!receivedMSG.type) return console.log("no type properties defined");

    switch (receivedMSG.type) {
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


async function onHandshake(ws: uWS.WebSocket, msg: any, state: State) {
    let p: Player;
    if (!state.guestLobby) {
        p = getGuestTemplate();

        // récupération du jeton dans le MSG
        const token = JSON.parse(decrypt(msg.token, state.lobbyOpts.secret as string));

        // vérification des infos
        const userdata = await getUser(token.username);

        if (userdata) {
            console.log("USERDATA :", userdata);
            p.username = userdata.username;
            
        } else {
            ws.send(JSON.stringify({
                type: PROTOCOLS.CONN_ERROR,
                error: "Erreur lors de l'authentification au serveur."
            }));
            return ws.close();
        }
    } else p = getGuestTemplate();


    state.addPlayer(ws, p);

    let initMSG = {
        type: PROTOCOLS.INIT_PLAYER,
        player: p,
        map: state.tileMatrix,
        obstacle: state.obstacleLines
    }

    ws.send(JSON.stringify(initMSG));
    ws.subscribe(PROTOCOLS.UPDATE + state.URL);
}

function onUpdate(ws: uWS.WebSocket, msg: any, state: State) {
    if (!ws.authenticated) return console.log("unauthenticated user can't update");
    if (!msg.player) return console.log("no player properties defined");

    let updatedPlayer: Player = msg.player;
    state.updatePlayer(ws, updatedPlayer);
}


/* Utils */

function getGuestTemplate(): Player {
    return {
        id: randomUUID(), //tracker dont mind
        username: "Guest_" + number++, //get from db
        x: 0,
        y: 0,
        speed: 10,
        action: "idle_down",
    };
}