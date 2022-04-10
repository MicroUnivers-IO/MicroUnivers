import { Container, AnimatedSprite, Text, Texture, Resource, Spritesheet } from 'pixi.js';

export class Player {

    private pview: Container
    private name: string;
    private nameSprite: Text;
    private currentSprite: AnimatedSprite;
    private walking: boolean;
    private playerScale: number;

    constructor(playerName:string, animation:AnimatedSprite, scale:number = 1.5) {
        this.name = playerName;
        this.playerScale = scale;

        this.currentSprite = animation;
        this.currentSprite.scale.x = this.playerScale;
        this.currentSprite.scale.y = this.playerScale;
        this.currentSprite.animationSpeed = 0.1;
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

    toggleWalk(){
        this.walking = !this.walking;
    }

    changeAnimation(animation: AnimatedSprite, reverse: boolean = false) {
        this.pview.removeChild(this.currentSprite);
        this.currentSprite = animation;
        this.currentSprite.x = 0;
        this.currentSprite.y = 0;
        this.currentSprite.scale.y = this.playerScale;
        this.currentSprite.animationSpeed = 0.1;
        if(reverse)
            this.currentSprite.scale.x = -this.playerScale;
	    else
            this.currentSprite.scale.x = this.playerScale;
        this.currentSprite.play();
        this.pview.addChild(this.currentSprite);
    }

    getView() {
        return this.pview;
    }

    getName() {
        return this.name;
    }

    getWalking() {
        return this.walking;
    }
}