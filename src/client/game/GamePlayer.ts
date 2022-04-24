import { Container, AnimatedSprite, Text, Spritesheet, Sprite } from 'pixi.js';
import { Player } from '../../lib/types/Player';

export class GamePlayer extends Container {

    player: Player;
    playerSheet: Spritesheet;    
    currentSprite: AnimatedSprite;
    nameSprite: Text;

    constructor(player: Player, spriteSheet: Spritesheet) {
        super();
        
        this.player = player;
        this.playerSheet = spriteSheet;
        this.position.set(player.x, player.y);

        let texture = spriteSheet.animations["idle"];

        this.currentSprite = new AnimatedSprite(texture);
        this.currentSprite.animationSpeed = 0.1;
        this.currentSprite.play();

        this.nameSprite = new Text(this.player.username, {
            fontFamily: 'Arial', fontSize: 12, fill: 0x000000, align: 'center'
        });

        this.currentSprite.x = 0;
        this.currentSprite.y = this.nameSprite.height;
        this.nameSprite.x = 0;
        this.nameSprite.y = 0;

        this.addChild(this.currentSprite);
        this.addChild(this.nameSprite);
    }

    updateMain(north: boolean, south: boolean, west: boolean, east: boolean){
        if(!north && !south && !west && !east) return;  //save time

        let horizontal = 0, vertical = 0;
        
        if(north) vertical += 1;
        if(south) vertical -= 1;
        if(west) horizontal -= 1;
        if(east) horizontal += 1;   
        
        let magnitude =  Math.sqrt(horizontal**2 + vertical**2)

        if(magnitude != 0){
            horizontal = Math.round((horizontal / magnitude) * this.player.speed);
            vertical = Math.round((vertical / magnitude) * this.player.speed); 
        }

        this.player.x += horizontal;
        this.player.y -= vertical;

        this.position.x += horizontal;
        this.position.y -= vertical; 
    }

    updateOther(){
        this.position.x = this.player.x;
        this.position.y = this.player.y; 
    }
}