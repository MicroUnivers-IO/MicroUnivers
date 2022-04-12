import { Container } from "pixi.js";
import { CompositeRectTileLayer } from "@pixi/tilemap";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle, Noise2Fn } from 'fractal-noise';

/**
 * Class representing the game map.
 * It contains a container of the map's layers and data related to its characteristics.
 * 
 * To use, create an instance of the object, generate the game view with the {@link generateView} method,
 * and use the {@link getView} method to get the game view.
 */
export class GameMap {
    private mapContainer: Container;
    private tileSize: number;
    private width: number;
    private height: number;
    private data: number[][];

    constructor(w:number = 100, h:number = 100, ts:number = 32) {
        this.tileSize = ts;
        this.width = w;
        this.height = h;

        this.data = this.perlinGeneration();
    }

    /**
     * Generates the view of the map.
     * 
     * Creates a CompositeRectileLayer as a tilemap and adds its tiles refering to the map's data.
     * Then, it adds the tilemap to the map container.
     * 
     * @param screenWidth Current screen width
     * @param screenHeight Current screen height
     */
    generateView(screenWidth: number, screenHeight: number):void {
        let tileAtPos:number;
        let tileTexture:string;
        let mapX:number;
        let mapY:number;
        let screenX:number;
        let screenY:number;

        this.mapContainer = new Container();
        let ground = new CompositeRectTileLayer(); 
        let rockTiles = new CompositeRectTileLayer();
        let rockLayer = makeRectangle(this.width, this.height, this.noiseToTile, {frequency: 0.05, octaves: 8});;
        
        // Adding the map's tiles. Goes through all the data matrix to add the tiles.
        // The tile's x and y position are calculated by multiplying the i and j indexes by the size of a tile.
        // 1 tile = 32px, so (i,j) = (x,y) = (i*32, j*32)
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                mapX = j;
                mapY = i;
                screenX =  mapX * this.tileSize;
                screenY =  mapY * this.tileSize;

                tileAtPos = this.data[mapX][mapY];
                if(rockLayer[i][j] >= 20){
                    tileTexture = 'assets/tileset/field_' + (tileAtPos*2).toString().padStart(2, '0') + '.png';
                    rockTiles.addFrame(tileTexture, screenX, screenY);
                }
                tileTexture = 'assets/tileset/field_' + tileAtPos.toString().padStart(2, '0') + '.png';
                ground.addFrame(tileTexture, screenX, screenY);
            }
        }
        this.mapContainer.addChild(ground);
        this.mapContainer.addChild(rockTiles);
    }

    /**
     * Fills the data array with tile number generated with the Simplex algorithm.
     * 
     * Uses the fast-simplex-noise module with the Math.random method.
     * Result is multiplied by the number of tiles.
     * 
     * @returns A two dimensional array containing the map's data.
     */
    perlinGeneration(): number[][] {
        let res = new Array(this.width);
        res = makeRectangle(this.width, this.height, this.noiseToTile);
        return res;
    }

    /**
     * Creates a function that calculates the tile number based on a noise value.
     *  
     * @param x The x coordinate of the tile
     * @param y The y coordinate of the tile
     * @returns An integer representing the tile number
     */
    noiseToTile(x:number, y:number):number {
        let noise:Noise2Fn = makeNoise2D();
        return Math.abs(Math.floor(noise(x,y) * 31))+1;
    }

    getView():Container {
        return this.mapContainer;
    }

    getWidth():number {
        return this.width;
    }

    getHeight():number {
        return this.height;
    }
}