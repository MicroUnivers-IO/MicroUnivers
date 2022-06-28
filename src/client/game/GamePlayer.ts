import { Container, AnimatedSprite, Text, Spritesheet, Sprite, Texture, Graphics } from 'pixi.js';
import { Line, linesCollinding } from '../../lib/common/Line';
import { getLimitLines } from '../../lib/common/MapComponent';
import { Rect } from '../../lib/common/Rect';
import { addAngle, degreeToRad, getDirectionAngle, isBetweenAngle, radToDegree } from '../../lib/common/utils';
import { Vector } from '../../lib/common/Vector';
import { Player } from '../../lib/types/Player';
import { GameApp } from './GameApp';

export class GamePlayer extends Container {

    static readonly ATTACK_RADIUS = 20;
    static readonly ATTACK_RANGE = 50;

    player: Player;
    playerSheet: Spritesheet;    
    currentSprite: AnimatedSprite;
    nameSprite: Text;
    
    constructor(player: Player, spriteSheet: Spritesheet) {
        super();
        console.log(player);
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
        
        this.nameSprite.x += -25;
        this.nameSprite.y += -40;

        this.addChild(this.nameSprite);
    
        this.addChild(this.currentSprite);
        this.position.set(player.x, player.y);
    }

    updateMain(up: boolean, down: boolean, left: boolean, right: boolean, attack: boolean, direction: string){
        let velocity = new Vector();

        if(attack){
            this.currentSprite.stop();
            this.currentSprite.textures = this.playerSheet.animations[`attack_${direction}`];
            this.player.action = `attack_${direction}`;
            this.currentSprite.play();
            this.handleAttack(direction);

            return;
        }

        if(!up && !down && !left && !right){
            if(!this.currentSprite.playing){
                this.currentSprite.textures = this.playerSheet.animations[`idle_${direction}`];
                this.player.action = `idle_${direction}`;
                this.currentSprite.play();
            }
            return;
        }
        
        if(left)  velocity.x -= 3;
        if(right) velocity.x += 3;
        if(up)    velocity.y += 3;
        if(down)  velocity.y -= 3;
        

        if(!this.currentSprite.playing){
            this.currentSprite.textures = this.playerSheet.animations[`walk_${direction}`];
            this.currentSprite.play()
            this.player.action = `walk_${direction}`;
        }

        let magnitude =  Math.sqrt(velocity.x**2 + velocity.y**2);

        if(magnitude != 0){
            velocity.x = Math.round(((velocity.x / magnitude) * 100)) / 100 * this.player.speed;
            velocity.y = Math.round(((velocity.y / magnitude) * 100)) / 100 * this.player.speed;
        }

        let obstacles = GameApp.obstacleLineQuadTree.getItemsInRadius(this.position.x, this.position.y, 100, 10) as Line[];
        obstacles.push(...getLimitLines());
        let hitbox = new Rect(this.position.x - 16, this.position.y - 16, 32, 32);
        velocity.handleCollision(obstacles, hitbox);


        this.player.x += velocity.x;
        this.player.y -= velocity.y;

        this.position.set(this.player.x, this.player.y);
    }

    // WORK IN PROGRESS
    /*updateMain2(up: boolean, down: boolean, left: boolean, right: boolean, attack: boolean, x:number, y:number) {
        this.updateMain(up, down, left, right, attack);
        this.x = x;
        this.y = y;
    }*/

    handleAttack(direction: string){
        let playerVec = new Vector(this.position.x, this.position.y);
        
        let directionAngle = getDirectionAngle(direction);
        
        for(let gameEntity of GameApp.entitys){
            let entityVec = new Vector(gameEntity.position.x, gameEntity.position.y);
            let dist = playerVec.distance(entityVec);
            
            if(dist > GamePlayer.ATTACK_RANGE) continue;
            
            let entityAngle = playerVec.getAngle(entityVec);

            if(isBetweenAngle(entityAngle, directionAngle.angleA, directionAngle.angleB)){
                gameEntity.entity.alive = false;
                console.log("dead");
            }
        }
    }

    updateOther(x: number, y:number, action:string) {
        this.player.x = x;
        this.player.y = y;
        this.player.action = action;

        if(!this.currentSprite.playing){
            this.currentSprite.textures = this.playerSheet.animations[this.player.action];
            this.currentSprite.play();
        }
        this.position.set(this.player.x, this.player.y);

    }

}