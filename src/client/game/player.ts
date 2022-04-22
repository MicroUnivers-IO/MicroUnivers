import { Container, AnimatedSprite, Text, Spritesheet } from 'pixi.js';
import { Animation } from './playerAnimations';

export class Player extends Container {

    private animations: Animation;
    private nameSprite: Text;
    private currentSprite: AnimatedSprite;
    private walking: boolean = false;

    constructor(playerName:string, sheet:Spritesheet) {
        super();

        this.animations = new Animation(sheet);

        this.currentSprite = this.animations.idleAnimation;
        this.currentSprite.animationSpeed = 0.1;
        this.currentSprite.play();

        this.nameSprite = new Text(playerName, {
            fontFamily: 'Arial', fontSize: 12, fill: 0x000000, align: 'center'
        });

        this.currentSprite.x = 0;
        this.currentSprite.y = this.nameSprite.height;
        this.nameSprite.x = 0;
        this.nameSprite.y = 0;

        this.addChild(this.currentSprite);
        this.addChild(this.nameSprite);
    }

    changeAnimation(animation: AnimatedSprite, reverse: boolean = false): void {
        this.removeChild(this.currentSprite);
        this.currentSprite.textures = animation.textures;

        if(reverse){
            this.currentSprite.scale.x = -1;
        }
	    else{
            this.currentSprite.scale.x = 1;
        }

        this.currentSprite.play();
        this.addChild(this.currentSprite);
    }

    manageWalk(reverse: boolean = false): void {
        this.walking = !this.walking;

        if(!this.walking) {
            this.changeAnimation(this.animations.forwardAnimation, reverse);
        }
        else{
            this.changeAnimation(this.animations.idleAnimation);
        }
    }
}