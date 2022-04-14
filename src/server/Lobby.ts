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
                messageHandler(ws, msg, isBinary, this.state);
            },
        
            close: (ws, code, msg) => {
                closeHandler(ws, code, msg, this.state); 
            }
        
        });

        // serverLoop(() => {
        //     app.publish(PROTOCOLS.UPDATE, JSON.stringify(this.state.getPlayers()))

        // })
    }


    

}