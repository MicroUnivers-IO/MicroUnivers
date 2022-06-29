import { AnimatedSprite, Container, Sprite, Spritesheet } from "pixi.js";
import { Entity } from "../../lib/types/Entity";

export class GameEntity extends Container{
    entity: Entity
    animatedSprite: AnimatedSprite;

    constructor(entity: Entity, spriteSheet: Spritesheet){
        super();
        this.entity = entity;
        
        let texture = spriteSheet.animations["loop"];
        this.animatedSprite = new AnimatedSprite(texture);
        this.animatedSprite.loop = true;
        this.animatedSprite.anchor.set(0.5);
        this.animatedSprite.scale.set(0.5, 0.5);
        this.animatedSprite.animationSpeed = 0.5;
        this.animatedSprite.play();
        this.addChild(this.animatedSprite);

        this.position.set(this.entity.x, this.entity.y);
    }

    update(updatedEntity: Entity){
        this.entity = updatedEntity;
        this.position.set(this.entity.x, this.entity.y);
    }
}