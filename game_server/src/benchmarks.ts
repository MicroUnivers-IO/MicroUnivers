"use strict";

import { TICK_SEC } from "./config";
import { serverLoop, serverLoopBad } from "./loop";

/* -------- Fonction pour benchmark le temps/nb d'exécutions -------- */
let startTime = performance.now();

let totalTicks = 0, nbBenchTicks = 1200, timeBetweenTicks = 1000 / TICK_SEC;
function updateGameBenchMark() {
    if (totalTicks == 0) console.log(`> updateGame benchmark en cours avec : ${TICK_SEC} t/s sur ${nbBenchTicks} ticks. Résultat attendu : ~${nbBenchTicks / TICK_SEC}s `)
    var start = Date.now()
    while (Date.now() < start.valueOf() + timeBetweenTicks) { }

    totalTicks++;
    process.stdout.cursorTo(0);
    process.stdout.write(`> updateGame n°${totalTicks}/${nbBenchTicks}`);

    if (totalTicks == nbBenchTicks) {
        let execTime = performance.now() - startTime;
        console.log(`\n>> Temps d'exécution : ${execTime/1000}ms`); 
        console.log(`>> Ticks par seconde executés : ${1000 / (execTime / nbBenchTicks)}`); 
        process.exit(1);
    }

}
/* ----------------------------------------------------------------- */

function updateGame() {
    //updatePlayers();
    //updateGameEvents();
    //updateEntities();
}


//serverLoopBad(updateGameBenchMark)
serverLoop(updateGameBenchMark);


