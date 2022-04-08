import { Container, AnimatedSprite, Text, Texture, Resource, Spritesheet } from 'pixi.js';

export class Player {

    private pview: Container
    private name: string;
    private nameSprite: Text;
    private currentSprite: AnimatedSprite;

    constructor(playerName:string, animation:AnimatedSprite) {
        this.name = playerName;
        this.currentSprite = animation;
        this.currentSprite.play();

        this.nameSprite = new Text(this.name, {fontFamily: 'Arial', fontSize: 12, fill: 0x000000, align: 'center'});
        this.pview = new Container();

        this.currentSprite.x = 0;
        this.currentSprite.y = 0;
        this.nameSprite.x = 0;
        this.nameSprite.y = this.currentSprite.height;

        this.pview.addChild(this.currentSprite);
        this.pview.addChild(this.nameSprite);
    }

    changeAnimation(animation: AnimatedSprite) {
        this.currentSprite = animation;
    }

    getView() {
        return this.pview;
    }

    getName() {
        return this.name;
    }
}