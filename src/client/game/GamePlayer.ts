import { Container, AnimatedSprite, Text, Spritesheet, Sprite } from 'pixi.js';
import { PLAYER_EVENTS } from '../../lib/enums/player_events';
import { Player } from '../../lib/types/Player';
import { GameApp } from './GameApp';

export class GamePlayer extends Container {

    player: Player;
    playerSheet: Spritesheet;    
    currentSprite: AnimatedSprite;
    nameSprite: Text;
    
    pastDirection: string;

    constructor(player: Player, spriteSheet: Spritesheet) {
        super();
        
        this.pastDirection = "down";
        this.player = player;
        this.playerSheet = spriteSheet;
        this.position.set(player.x, player.y);

        let texture = spriteSheet.animations["idle_down"];

        this.currentSprite = new AnimatedSprite(texture);
        this.currentSprite.loop = false;
        this.currentSprite.animationSpeed = 0.5;
        this.currentSprite.play();
        this.currentSprite.scale.set(2,2);

        this.nameSprite = new Text(this.player.username, {
            fontFamily: 'Verdana', fontSize: 12, fill: "#e6e6e6", align: 'center'
        });

        this.addChild(this.currentSprite);
        this.addChild(this.nameSprite);

        this.currentSprite.x = (this.nameSprite.width / 2) - (this.currentSprite.width / 2);
        this.currentSprite.y = -14;
        this.nameSprite.x = 0;
        this.nameSprite.y = 0;
    }

    updateMain(up: boolean, down: boolean, left: boolean, right: boolean, attack: boolean){
        let horizontal = 0, vertical = 0;

        if(attack){
            this.currentSprite.stop();
            this.currentSprite.textures = this.playerSheet.animations["attack_" + this.pastDirection];
            this.player.action = "attack_" + this.pastDirection;
            this.currentSprite.play();
            
            return;
        }

        if(!up && !down && !left && !right){
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations["idle_" + this.pastDirection];
                this.player.action = "idle_" + this.pastDirection;
                this.currentSprite.play();
            }
            return;
        }
        
        if(left){
            horizontal -= 3;
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations["walk_left"];
                this.currentSprite.play()
                this.player.action = "walk_left";
                this.pastDirection = "left";
            }
        }
        
        if(right){
            horizontal += 3;
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations["walk_right"];
                this.currentSprite.play()
                this.player.action = "walk_right";
                this.pastDirection = "right";
            }
        }
        
        if(up){
            vertical += 3;
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations["walk_up"];
                this.currentSprite.play()
                this.player.action = "walk_up";
                this.pastDirection = "up";
            }
        }
        
        if(down){
            vertical -= 3;
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations["walk_down"];
                this.currentSprite.play()
                this.player.action = "walk_down";
                this.pastDirection = "down";
            }
        }

        let magnitude =  Math.sqrt(horizontal**2 + vertical**2);

        if(magnitude != 0){
            horizontal = Math.round(((horizontal / magnitude) * 100)) / 100 * this.player.speed;
            vertical = Math.round(((vertical / magnitude) * 100)) / 100 * this.player.speed;
        }

        this.player.x += horizontal;
        this.player.y -= vertical;

        this.position.x = this.player.x;
        this.position.y = this.player.y; 
    }

    updateOther(){
        if(!this.currentSprite.playing){
            this.currentSprite.textures = this.playerSheet.animations[this.player.action];
            this.currentSprite.play();
        }

        this.position.set(this.player.x, this.player.y);
    }
}