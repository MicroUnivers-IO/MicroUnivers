const tickLengthMs = 1000;

let previousTick = Date.now();
let actualTicks = 0;

export const serverLoop  = (callback: VoidFunction) => {
  // eslint-disable-next-line prefer-const
  let now = Date.now();

  actualTicks++;
  if (previousTick + tickLengthMs <= now) {
    previousTick = now;
    callback();
    actualTicks = 0;
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(serverLoop.bind(null, callback));
  } else {
    setImmediate(serverLoop.bind(null, callback));
  }
}
