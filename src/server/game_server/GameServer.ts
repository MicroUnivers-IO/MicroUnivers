import uWS from "uWebSockets.js";
import { randomUUID } from "crypto";
import { Lobby } from "./Lobby";

interface SSLOpts {
    //activated: Boolean;
    certPath: string;
    keyPath: string;
}

export class GameServer {

    private socketApp: uWS.TemplatedApp;

    private port: number;
    private servName: string;
    private lobbies: Lobby[];
    public isSSL: boolean;

    constructor(servName: string, port: number, SSLOpts?: SSLOpts) {
        this.servName = servName;
        this.port = port;
        this.lobbies = [];
        
        if (!SSLOpts) {
            // Init without ssl
            this.isSSL = false;
            this.socketApp = uWS.App();
        } else {
            this.isSSL = true;
            this.socketApp = uWS.SSLApp({
                cert_file_name: SSLOpts.certPath,
                key_file_name: SSLOpts.keyPath
            })
        }

        this.socketApp.listen(port, success => {
            success ?
                console.log(`🚀 Le serveur ${servName} est lancé sur le port : ${port}.`) :
                console.log(`💥 Erreur dans le lancement dans la socket sur le port : ${port}`);
        });
    }

    public createLobby(url: string = randomUUID(), tickInterval:number = 50) {  // By default 20 tick/s
        let lobby = new Lobby(this.socketApp, url).launch(tickInterval);
        this.lobbies.push(lobby);
        return lobby;
    }


    public getLobby(url: string) {
        for(let i = 0; i < this.lobbies.length; ++i)
            if(this.lobbies[i].getURL() == url) return this.lobbies[i]

        return null;
    }

}