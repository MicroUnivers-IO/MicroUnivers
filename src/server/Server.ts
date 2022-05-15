import express from "express";
import { GameServer } from "./game_server/GameServer";

const server = express();
const port = 8001;

server.use(express.static('./src/client/static'));

server.listen(port, () => {
  console.log(`💻 Serveur web lancé sur le port : ${port} - http://localhost:8001/`)
})

let gameServer = new GameServer("GameServer_Dev", 7777 /*,{
    certPath: "",
    keyPath: "",
}*/);

gameServer.createLobby("/dev1", 50);
