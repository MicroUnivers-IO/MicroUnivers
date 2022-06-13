import { Container, Graphics, Resource, Spritesheet, Texture } from "pixi.js";
import { CompositeTilemap } from "@pixi/tilemap";

import { MapComponent, MAP_COMPONENT_TYPE } from "../../lib/common/MapComponent";
import { MAP_HEIGTH, MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../../lib/common/const";


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

    
    private tileMatrix: MapComponent[][];
    private tileSheet: Spritesheet;

    constructor(tileSheet: Spritesheet, tileMatrix: MapComponent[][]) {
        super();
        
        this.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.tileSheet = tileSheet;
        this.tileMatrix = tileMatrix;

        let ground = new CompositeTilemap();
        this.addChild(ground);


        for (let row = 0; row < MAP_HEIGTH; row++) {    
            for (let col = 0; col < MAP_WIDTH; col++) {                
                let texture = this.getSprite(row, col);
                ground.tile(texture, col * TILE_WIDTH, row * TILE_HEIGHT);
            }
        }
    }

    private getNeighborApproval(row: number, col: number, obstacle: MapComponent): number{
        return ((row < 0 || row >= 100 || col < 0 || col >= 100) ? false : this.tileMatrix[row][col].type === obstacle.type) ? 1 : 0;
    }
    
    private getSprite(row: number, col: number): Texture<Resource>{
        let obstacle = this.tileMatrix[row][col];
        
        if(obstacle.type === MAP_COMPONENT_TYPE.BASEGROUND) return this.tileSheet.textures["tile041.png"];
        
        let rect = new Graphics();
        rect.beginFill(0xFFFF00);
        rect.lineStyle(5, 0xFF0000);
        rect

        let threshold = obstacle.threshold;

        //cardinal 
        let north = this.getNeighborApproval(row - 1, col, obstacle);
        let west = this.getNeighborApproval(row, col - 1, obstacle); 
        let east = this.getNeighborApproval(row, col +  1, obstacle); 
        let south = this.getNeighborApproval(row + 1, col, obstacle);

        //corners (require cardinal presence)
        let southWest = (south == 1 && west == 1) ? this.getNeighborApproval(row + 1, col - 1, obstacle) : 0;
        let northWest = (north == 1 && west == 1) ? this.getNeighborApproval(row - 1, col - 1, obstacle) : 0; 
        let northEast = (north == 1 && east == 1) ? this.getNeighborApproval(row - 1, col + 1, obstacle) : 0; 
        let southEast = (south == 1 && east == 1) ? this.getNeighborApproval(row + 1, col + 1, obstacle) : 0;
        
        let bitValue = northWest * 1 + north * 2 + northEast * 4 + west * 8 + east * 16 + southWest * 32 + south * 64 + southEast * 128;
 
        return this.tileSheet.textures["tile0" + ('0' + (GameMap.tileDict[bitValue] + threshold)).slice(-2) + ".png"];
    }

}
