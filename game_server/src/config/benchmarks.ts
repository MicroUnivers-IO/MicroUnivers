"use strict";

import { TICK_SEC } from "./config";

const tickLengthMs = 1000 / TICK_SEC;

let previousTick = Date.now();
let actualTicks = 0;

let serverLoop  = (update: Function) => {
  let now = Date.now();

  actualTicks++;
  if (previousTick + tickLengthMs <= now) {
    previousTick = now;
    update();
    actualTicks = 0;
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(serverLoop.bind(null, update));
  } else {
    setImmediate(serverLoop.bind(null, update));
  }
}

let serverLoopBad = (update: Function) => {
  setInterval(() => update(), tickLengthMs);
}


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


//serverLoopBad(updateGameBenchMark)
serverLoop(updateGameBenchMark);


