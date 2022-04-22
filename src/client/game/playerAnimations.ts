import { AnimatedSprite, Spritesheet } from "pixi.js";

export class Animation {
    spritesheet: Spritesheet;
    forwardAnimation: AnimatedSprite;
    backwardAnimation: AnimatedSprite;
    leftAnimation: AnimatedSprite;
    rightAnimation: AnimatedSprite;
    idleAnimation: AnimatedSprite;

    constructor(spritesheet: Spritesheet) {
        this.spritesheet = spritesheet;
        this.forwardAnimation = new AnimatedSprite(spritesheet.animations["walk"]);
        this.backwardAnimation = new AnimatedSprite(spritesheet.animations["walk"]);
        this.leftAnimation = new AnimatedSprite(spritesheet.animations["walk"]);
        this.rightAnimation = new AnimatedSprite(spritesheet.animations["walk"]);
        this.idleAnimation = new AnimatedSprite(spritesheet.animations["idle"]);
    }
}