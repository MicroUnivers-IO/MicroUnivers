import { TICK_SEC } from "./config";

const tickLengthMs = 1000 / TICK_SEC;

let previousTick = Date.now()
let actualTicks = 0

export let serverLoop  = (update: Function) => {
  let now = Date.now()

  actualTicks++
  if (previousTick + tickLengthMs <= now) {
    let delta = (now - previousTick) / 1000
    previousTick = now;

    update();

    //console.log('delta', delta, '(target: ' + tickLengthMs +' ms)', 'node ticks', actualTicks);
    actualTicks = 0;
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(serverLoop.bind(null, update));
  } else {
    setImmediate(serverLoop.bind(null, update));
  }
}
