import { GameServer } from "./GameServer";

let gameServer = new GameServer("GameServer_Dev", 7777 /*,{
    certPath: "",
    keyPath: "",
}*/);

gameServer.createLobby("/dev1", 50);
//gameServer.createLobby("/dev2", 50);