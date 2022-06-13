import { Container, Sprite, Spritesheet } from "pixi.js";
import { addAngle, degreeToRad } from "../../lib/common/utils";
import { Vector } from "../../lib/common/Vector";
import { Entity } from "../../lib/types/Entity";
import { ServEntity } from "../../server/game_server/ServEntity";
import { GameApp } from "./GameApp";

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