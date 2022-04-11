import { Container, AnimatedSprite, Text } from 'pixi.js';

/**
 * Class representing a player.
 * It contains a container that has the player sprite and his name.
 * Also has data related to its characteristics.
 * 
 * To use, create an instance of the object and use the {@link getView} method to get the player's view.
 */
export class Player {

    private pview: Container
    private name: string;
    private nameSprite: Text;
    private currentSprite: AnimatedSprite;
    private walking: boolean;
    private playerScale: number;
    private playerSpeed: number;

    constructor(playerName:string, animation:AnimatedSprite, scale:number = 1.5, speed:number = 3) {
        this.name = playerName;
        this.playerScale = scale;
        this.playerSpeed = speed;

        this.currentSprite = animation;
        this.currentSprite.scale.x = this.playerScale;
        this.currentSprite.scale.y = this.playerScale;
        this.currentSprite.animationSpeed = 0.1;
        this.currentSprite.play();

        this.nameSprite = new Text(this.name, {fontFamily: 'Arial', fontSize: 12, fill: 0x000000, align: 'center'});
        this.pview = new Container();
        this.pview.width = this.currentSprite.width;
        this.pview.height = this.currentSprite.height;

        this.currentSprite.x = 0;
        this.currentSprite.y = 0;
        this.nameSprite.x = 0;
        this.nameSprite.y = this.currentSprite.height;

        this.pview.addChild(this.currentSprite);
        this.pview.addChild(this.nameSprite);
    }

    toggleWalk(): void {
        this.walking = !this.walking;
    }

    /**
     * Changes the player's animation.
     * 
     * Deletes the AnimatedSprite that was previously set and replaces it with the new one.
     * The player's view needs to be re-added to the app after.
     * 
     * @param animation AnimatedSprite to change to
     * @param reverse Whether the player should be facing left or right
     */
    changeAnimation(animation: AnimatedSprite, reverse: boolean = false): void {
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

    getView(): Container {
        return this.pview;
    }

    getName(): string {
        return this.name;
    }

    getWalking(): boolean {
        return this.walking;
    }

    getSpeed(): number {
        return this.playerSpeed;
    }
}