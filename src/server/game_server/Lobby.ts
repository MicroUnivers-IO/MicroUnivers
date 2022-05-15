import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler"; 
import { State } from "./State";
import { Loop } from "../../lib/Loop";


export class Lobby {

    private app: uWS.TemplatedApp;
    private state: State;
    private PROTOCOLS_ENUM: any;


    constructor(app: uWS.TemplatedApp, URL: string) {

        this.app = app;
        this.state = new State(URL);

        this.PROTOCOLS_ENUM = Object.freeze({
            UPDATE: PROTOCOLS.UPDATE + this.state.URL
        });

        this.app.ws(URL, {
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
            this.app.publish(this.PROTOCOLS_ENUM.UPDATE, JSON.stringify({
                type: this.PROTOCOLS_ENUM.UPDATE,
                players: this.state.getPlayers(),
                t: Date.now()
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

}