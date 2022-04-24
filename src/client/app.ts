import { GameApp } from "./game/GameApp";


GameApp.init("/dev1");

window.addEventListener("resize", () => GameApp.resizeHandler());
window.addEventListener("keydown", e => GameApp.keyPressHandler(e, true));
window.addEventListener("keyup", e => GameApp.keyPressHandler(e, false));



