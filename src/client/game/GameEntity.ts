import { Container, Sprite } from "pixi.js";
import { Entity } from "../../lib/types/Entity";

export class GameEntity extends Container{
    entity: Entity
    sprite: Sprite;

    constructor(entity: Entity, sprite: Sprite){
        super();
        this.entity = entity;
        this.sprite = sprite;
        sprite.anchor.set(0.5);
        this.addChild(sprite);

        this.position.set(this.entity.x, this.entity.y);
    }

    update(updatedEntity: Entity){
        this.entity = updatedEntity;
        this.position.set(this.entity.x, this.entity.y);
    }
}