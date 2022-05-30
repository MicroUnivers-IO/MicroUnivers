import { Container, AnimatedSprite, Text, Spritesheet } from 'pixi.js';
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

        this.nameSprite = new Text(this.player.username, {
            fontFamily: 'Verdana', fontSize: 12, fill: "#e6e6e6", align: 'center'
        });

        let texture = spriteSheet.animations["idle_down"];

        this.currentSprite = new AnimatedSprite(texture);
        this.currentSprite.loop = false;
        this.currentSprite.animationSpeed = 0.5;
        this.currentSprite.scale.set(2.2, 2.2);
        this.currentSprite.play();
        
        
        this.currentSprite.anchor.set(0.5);
       
        // this.addChild(this.nameSprite);
        
        // this.currentSprite.x = (this.nameSprite.width / 2) - (this.currentSprite.width / 2);
        // this.currentSprite.y = -14;
        // this.nameSprite.anchor.set(0.5);
        // this.nameSprite.x = 0;
        // this.nameSprite.y = -this.currentSprite.height;
        // let test = new Text(".");
        // test.anchor.set(0.5);
        // test.y = -15
        // this.addChild(test);


        this.addChild(this.currentSprite);
        this.position.set(player.x, player.y);
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
                this.player.action = "idle";
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

//         let tempX = Math.round(((this.player.x) + horizontal) / 32);
//         let tempY = Math.round(((this.player.y) + vertical) / 32);
// //tempX < 0 || tempX >= 100 || tempY < 0 || tempY > 100 || 
//         let bound = this.getBounds();
//         console.log("x " +bound.x);
//         console.log("y " +bound.y);
//         console.log("width" + bound.width);
//         console.log("height" + bound.height);
//         if(GameApp.collisionMatrix[tempY][tempX] == 1){
            
//             console.log(tempX);
//             console.log(tempY);
//             console.log(GameApp.collisionMatrix[tempY][tempX]);
//             return;
//         } 

        this.player.x += horizontal;
        this.player.y -= vertical;

        this.position.set(this.player.x, this.player.y)
    }

    // WORK IN PROGRESS
    /*updateMain2(up: boolean, down: boolean, left: boolean, right: boolean, attack: boolean, x:number, y:number) {
        this.updateMain(up, down, left, right, attack);
        this.x = x;
        this.y = y;
    }*/

    updateOther(x: number, y:number, action:string) {
        this.player.x = x;
        this.player.y = y;
        this.player.action = action;

        if(!this.currentSprite.playing){
            this.currentSprite.textures = this.playerSheet.animations[this.player.action];
            this.currentSprite.play();
        }
        this.position.set(this.player.x - this.width / 2, this.player.y - this.height / 2);
    }

}