import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";
import { serverLoop } from "./loop";
import { State } from "./State";


export class Lobby{

    private readonly lobbyURL: string;

    private app: uWS.TemplatedApp;
    private state: State;

    constructor(app:uWS.TemplatedApp, URL: string){
        this.app = app;
        this.lobbyURL = URL;

        this.state = new State();

        this.app.ws(URL, {
            // config
            compression: 0,
            maxPayloadLength: 16 * 1024 * 1024,
            idleTimeout: 60,
        
            open: (ws) => {
                ws.url = URL;
                openHandler(ws, this.state);
            },
        
            message: (ws, msg, isBinary) => {
                messageHandler(ws, msg, isBinary, this);
            },
        
            close: (ws, code, msg) => {
                closeHandler(ws, code, msg, this.state); 
            }
        
        });

        setInterval(() => {
            app.publish(PROTOCOLS.UPDATE + this.lobbyURL, JSON.stringify({ msg: this.lobbyURL + "   --   " + JSON.stringify(this.state.getPlayers()) }));
        }, 2000)
        
        // serverLoop(() => {
        //     app.publish(PROTOCOLS.UPDATE + lobbyURL, JSON.stringify(this.state.getPlayers()))

        // });
    }


    getUrl() {
        return this.lobbyURL;
    }

    getState() {
        return this.state;
    }

}