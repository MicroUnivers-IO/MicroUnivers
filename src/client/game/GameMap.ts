import { BaseTexture, Container, Resource, Sprite, Spritesheet, Texture } from "pixi.js";
import { CompositeRectTileLayer, CompositeTilemap, Tilemap } from "@pixi/tilemap";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle, Noise2Fn } from 'fractal-noise';
import { GameApp } from "./GameApp";
import { ECDH } from "crypto";


export class GameMap extends Container {
    
    private static readonly tileDict: any = {
        2: 2,
        8: 15,
        10: 14, 
        11: 47,
        16: 7,
        18: 6,
        22: 35, 
        24: 11,
        26: 10, 
        27: 27, 
        30: 23, 
        31: 39, 
        64: 0,  
        66: 1, 
        72: 12, 
        74: 13,  
        75: 30, 
        80: 4,
        82: 5,
        86: 18,
        88: 8,
        90: 9,
        91: 16,
        94: 28,
        95: 43,
        104: 44, 
        106: 29, 
        107: 46, 
        120: 24, 
        122: 19, 
        123: 45, 
        126: 37, 
        127: 26,
        208: 32,
        210: 17, 
        214: 33,
        216: 20,
        218: 31, 
        219: 42, 
        222: 34, 
        223: 22, 
        248: 40,
        250: 36, 
        251: 25, 
        254: 21,
        255: 38, 
        0: 3
    }

    private static readonly tileSize = 32;
    private static readonly width = 100;
    private static readonly height = 100;
    private noise: number[][];
    private tileSheet: Spritesheet;

    constructor(tileSheet: Spritesheet, noise: number[][]) {
        super();
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.tileSheet = tileSheet;
        this.noise = noise;
        
        let ground = new CompositeTilemap();
        this.addChild(ground);

        for (let row = 0; row < GameMap.height; row++) {    
            for (let col = 0; col < GameMap.width; col++) {
                let texture = this.getSprite(row, col);
                ground.tile(texture, col * GameMap.tileSize, row * GameMap.tileSize);
            }
        }
    }

    private getTileType(row: number, col: number, condition: (noiseValue: number) => boolean): number{
        return (row < 0 || row >= 100 || col < 0 || col >= 100) ? 0 : condition(this.noise[row][col]) ? 1 : 0;
    }
    
    private getSprite(row: number, col: number): Texture<Resource>{
        let condition;
        let threshold;
        if(this.noise[row][col] > 0.5){
            threshold = 0;
            condition = (noiseValue: number) => {return noiseValue > 0.5};
        } else if(this.noise[row][col] < -0.3){
            threshold = 48;
            condition = (noiseValue: number) => {return noiseValue < -0.3};
        } else return this.tileSheet.textures["tile041.png"];

        //cardinal 
        let north = this.getTileType(row - 1, col, condition);
        let west = this.getTileType(row, col - 1, condition); 
        let east = this.getTileType(row, col +  1, condition); 
        let south = this.getTileType(row + 1, col, condition);

        //corners (require cardinal presence)
        let southWest = (south == 1 && west == 1) ? this.getTileType(row + 1, col - 1, condition) : 0;
        let northWest = (north == 1 && west == 1) ? this.getTileType(row - 1, col - 1, condition) : 0; 
        let northEast = (north == 1 && east == 1) ? this.getTileType(row - 1, col + 1, condition) : 0; 
        let southEast = (south == 1 && east == 1) ? this.getTileType(row + 1, col + 1, condition) : 0;
        
        let bitValue = northWest * 1 + north * 2 + northEast * 4 + west * 8 + east * 16 + southWest * 32 + south * 64 + southEast * 128;
 
        return this.tileSheet.textures["tile0" + ('0' + (GameMap.tileDict[bitValue] + threshold)).slice(-2) + ".png"];
    }

}