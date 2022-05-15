import { GameApp } from "./GameApp";

export class GameState {

    static gameUpdates: any[] = []; // Buffer des updates
    static firstServerTimestamp: number; // Timestamp de la première update reçu du serveur
    static gameStartTimestamp: number; // Début de la game

    // Temps en MS définissant la latence a avec le temps du serveur
    // A noter : le temps présent du client est en "retard" de RENDER_DELAY par rapport
    // au serveur --> necessaire pour la fluidité et compenser les potentielles latences
    static RENDER_DELAY: number = 50;

    // Estimation du temps présent sur le serveur
    static currentServerTime() {
        return this.firstServerTimestamp + (Date.now() - this.gameStartTimestamp) - this.RENDER_DELAY;
    }

    // Trigger lors de la reception d'une update côté client
    static processGameUpdate(srvUpdate: any) {

        if (!this.firstServerTimestamp) {
            this.firstServerTimestamp = srvUpdate.t;
            this.gameStartTimestamp = Date.now();
        }

        // Filtrage de l'array de joueurs pour déterminer "self" --> le joueur du client
        const mainId = GameApp.mainPlayer.player.id;
        srvUpdate.players = srvUpdate.players.filter((player: { id: string; }) => {
            if (player.id != mainId) return true;
            else {
                srvUpdate.self = player;
                return false;
            }
        });

        this.gameUpdates.push(srvUpdate);

        // Clear le buffer des game updates si il y en a une
        const base = this.getBaseUpdate();
        if (base > 0) {
            this.gameUpdates.splice(0, base);
        }
    }


    // Retourne l'index de la première update antérieure au temps 
    // du serveur
    static getBaseUpdate() {
        for (let i = this.gameUpdates.length - 1; i >= 0; i--) {
            if (this.gameUpdates[i].t <= this.currentServerTime()) {
                return i;
            }
        }
        return -1;
    }

    // Retourne l'état du jeu actuel en interpolant linéairement les 
    // différentes positions des entités
    static getCurrentState() {

        // En attendant la première updaate du serveur on retourne un objet vide
        if (!this.firstServerTimestamp) return { self: { x: 0, y: 0 }, players: [] };

        const base = this.getBaseUpdate();

        // Si on n'a pas de nouveau state du serveur, pas le choix que d'utiliser le seul qu'on possède
        // Sinon, interpolation linéaire des variables de mouvements pour la fluidité
        if (base < 0 || base === this.gameUpdates.length - 1) {
            return this.gameUpdates[this.gameUpdates.length - 1];
        } else {
            const baseUpdate = this.gameUpdates[base];
            const nextUpdate = this.gameUpdates[base + 1];
            const ratio = (this.currentServerTime() - baseUpdate.t) / (nextUpdate.t - baseUpdate.t); // ratio pour l'interpolation linéaire
            return {
                self: this.interpolateXY(baseUpdate.self, nextUpdate.self, ratio),
                players: this.interpolateXYArr(baseUpdate.players, nextUpdate.players, ratio),
            }
        }
    }

    // Calcule l'interpolation linéaire entre le X,Y de deux objets
    static interpolateXY(object1: any, object2: any, ratio: number) {
        if (!object2) return object1;
        object1.x = object1.x + (object2.x - object1.x) * ratio;
        object1.y = object1.y + (object2.y - object1.y) * ratio;
        return object1;
    }

    // Map le calcul de l'interpolation linéaire X,Y sur deux arrays d'objets (possédant des propriétés X et Y)
    static interpolateXYArr(objects1: any, objects2: any, ratio: number) {
        return objects1.map((o: { id: any; }) => this.interpolateXY(o, objects2.find((o2: { id: any; }) => o.id === o2.id), ratio));
    }

}
