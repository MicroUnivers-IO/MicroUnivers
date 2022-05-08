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

    constructor(servName: string, port: number, SSLOpts?: SSLOpts) {
        this.servName = servName;
        this.port = port;
        this.lobbies = [];
        
        if (!SSLOpts) {
            // Init without ssl
            this.socketApp = uWS.App();
        } else {
            console.log(SSLOpts)
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

    public createServ(url: string = randomUUID()) {
        this.lobbies.push(new Lobby(this.socketApp, url).launch());
    }

}