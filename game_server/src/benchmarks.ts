"use strict";

import { TICK_SEC } from "./config";
import { serverLoop, serverLoopBad } from "./loop";

/* -------- Fonction pour benchmark le temps/nb d'exécutions -------- */
console.time("Temps total : ");
let totalTicks = 0, nbBenchTicks = 200;
function updateGameBenchMark() {
    if (totalTicks == 0) console.log(`> updateGame benchmark en cours avec : ${TICK_SEC} t/s sur ${nbBenchTicks} ticks. Résultat attendu : ~${nbBenchTicks / TICK_SEC}s `)
    var start = Date.now()
    while (Date.now() < start.valueOf() + 1000 / TICK_SEC) { }

    totalTicks++;
    process.stdout.cursorTo(0);
    process.stdout.write(`> updateGame n°${totalTicks}/${nbBenchTicks}`);

    if (totalTicks == nbBenchTicks) {
        console.timeEnd("Temps total ");
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


