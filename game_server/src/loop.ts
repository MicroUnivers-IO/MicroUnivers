import { TICK_SEC } from "./config";

const tickLengthMs = 1000 / TICK_SEC;

let previousTick = Date.now();
let actualTicks = 0;

export let serverLoop  = (update: Function) => {
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

export let serverLoopBad = (update: Function) => {
  setInterval(() => update(), tickLengthMs);
}