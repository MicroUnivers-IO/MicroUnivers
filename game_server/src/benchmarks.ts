"use strict";

import { TICK_SEC } from "./config";
import { serverLoop, serverLoopBad } from "./loop";

/* -------- Fonction pour benchmark le temps/nb d'exécutions -------- */
console.time("temps");
let nbTime = 0, nbBenchTicks = 300;
function updateGameBenchMark() {
    if (nbTime == 0) console.log(`> updateGame benchmark en cours avec : ${TICK_SEC} t/s sur ${nbBenchTicks} ticks. Résultat attendu : ~${nbBenchTicks / TICK_SEC}s `)
    var start = Date.now()
    while (Date.now() < start.valueOf() + 1000 / TICK_SEC) { }

    nbTime++;
    if (nbTime == nbBenchTicks) {
        console.log(`Total updateGame :${nbTime}`); console.timeEnd("temps");
        process.exit(1);
    }
    console.log("Oui !");
}
/* ----------------------------------------------------------------- */

function updateGame() {
    //updatePlayers();
    //updateGameEvents();
    //updateEntities();
}


//serverLoopBad(updateGameBenchMark)
serverLoop(updateGameBenchMark);


