import { GameServer } from "./GameServer";

let gameServer = new GameServer("GameServer_Dev", 7777 /*,{
    certPath: "",
    keyPath: "",
}*/);

gameServer.createServ("/dev1");