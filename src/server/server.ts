import uWS from "uWebSockets.js";
import { Lobby } from "./Lobby";

const port = 7777;

const lobbies: Lobby[] = [];

const app = uWS.App().listen(port, success => {
    success ?
        console.log(`Le serveur de socket écoute sur le port : ${port}`) :
        console.log(`Erreur dans le lancement dans la socket sur le port : ${port}`);
});

lobbies.push(new Lobby(app, "/dev1"));
lobbies.push(new Lobby(app, "/dev2"));
