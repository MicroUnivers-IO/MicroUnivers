import { BaseTexture, Container, Texture } from "pixi.js";
import { CompositeRectTileLayer, CompositeTilemap, Tilemap } from "@pixi/tilemap";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle, Noise2Fn } from 'fractal-noise';

export class GameMap extends Container {
    private static readonly tileSize = 32;
    private static readonly column = 100;
    private static readonly row = 100;
    
    constructor() {
        super();
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
        
        // const noise = makeNoise2D();
        // let mapJSON: number[][];        

        let ground = new CompositeTilemap();
        
        for (let i = 0; i < GameMap.row; i++) {
            for (let j = 0; j < GameMap.column; j++) {
                // console.log(noise(i,j));
                ground.tile(Texture.from("assets/tileset/field_01.png") , i * GameMap.tileSize, j * GameMap.tileSize);
            }
        }

        this.addChild(ground);
    }
}