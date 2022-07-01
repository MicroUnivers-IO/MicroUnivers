import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";
import { State } from "./State";
import { Loop } from "../../lib/Loop";
import { randomBytes } from "crypto";


const SECRET_LEN = 16; // 32 bytes

export interface LobbyOpts {
    url: string,
    name: string,
    guestLobby: boolean,
    maxPlayer: number,
    port?: number,
    secret?: string
}

export class Lobby {

    private app: uWS.TemplatedApp;
    private state: State;
    private PROTOCOLS_ENUM: any;
    private lobbyOpts: LobbyOpts;

    constructor(app: uWS.TemplatedApp, opts: LobbyOpts) {

        this.app = app;
        this.state = new State(opts);
        this.lobbyOpts = opts;


        if(!this.lobbyOpts.guestLobby) {
            this.lobbyOpts.secret = randomBytes(SECRET_LEN).toString("hex");
        }

        this.PROTOCOLS_ENUM = Object.freeze({
            UPDATE: PROTOCOLS.UPDATE + this.state.URL
        });

        this.app.ws(opts.url, {
            // config
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 16,

            open: (ws) => {
                ws.url = URL;
                openHandler(ws, this.state);
            },

            message: (ws, msg, isBinary) => {
                messageHandler(ws, msg, isBinary, this.state);
            },

            close: (ws, code, msg) => {
                closeHandler(ws, code, msg, this.state);
            }

        });

    }


    launch(tickInterval: number) {
        new Loop(tickInterval, () => {
            this.state.updateEntitys();

            this.app.publish(this.PROTOCOLS_ENUM.UPDATE, JSON.stringify({
                type: this.PROTOCOLS_ENUM.UPDATE,
                players: this.state.getPlayers(),
                entitys: this.state.entities,
                t: Date.now(),
            }));
        }).start();

        return this; //chaining 😎
    }

    overview() {
        return {
            url: this.state.URL,
            nbPlayer: this.state.players.length
        }
    }

    getURL() {
        return this.state.URL;
    }

    getLobbyInfos() {
        return { ...this.lobbyOpts, 
            nbPlayers: Object.getOwnPropertyNames(this.state.players).length,
            guestLobby: this.lobbyOpts.guestLobby
        };
    }
}