import uWS from "uWebSockets.js";
import { PROTOCOLS } from "../lib/enums/protocols";
import { closeHandler } from "./handlers/closeHandler";
import { messageHandler } from "./handlers/messageHandler";
import { openHandler } from "./handlers/openHandler";
import { serverLoop } from "./loop";
import { State } from "./State";


export class Lobby{

    private app: uWS.TemplatedApp;
    private state: State;

    constructor(app:uWS.TemplatedApp, URL: string){
        this.app = app;

        this.state = new State(URL);

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
    }

    launch(){
        serverLoop(() =>{
            let updateMSG = {
                type: PROTOCOLS.UPDATE + this.state.getURL(),
                players: this.state.getPlayers()
            }
            this.app.publish(PROTOCOLS.UPDATE + this.state.getURL(), JSON.stringify(updateMSG));
        });
        
        return this; //chaining 😎
    }
}