import { Container } from "pixi.js";
import { CompositeRectTileLayer } from "@pixi/tilemap";
import { makeNoise2D } from "fast-simplex-noise";

/**
 * Class representing the game map.
 * It contains a container of the map's layers and data related to its characteristics.
 * 
 * To use, create an instance of the object, generate the game view with the {@link generateView} method,
 * and use the {@link getView} method to get the game view.
 */
export class GameMap {
    private mapNoise: Function;
    private mapContainer: Container;
    private ground: CompositeRectTileLayer;
    private tileSize: number;
    private width: number;
    private height: number;
    private data: number[][];

    constructor(w:number = 100, h:number = 100, ts:number = 32) {
        this.tileSize = ts;
        this.width = w;
        this.height = h;

        this.data = [];
        this.mapNoise = makeNoise2D();
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
        this.ground = new CompositeRectTileLayer();        

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
                tileTexture = 'assets/tileset/field_' + tileAtPos.toString().padStart(2, '0') + '.png';
                this.ground.addFrame(tileTexture, screenX, screenY);
            }
        }
        this.mapContainer.addChild(this.ground);
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
        let res: number[][] = [];
        for(let i = 0; i < this.height; i++){
            res[i] = [];
            for(let j = 0; j < this.width; j++)
                res[i][j] = Math.abs(Math.floor(this.mapNoise(i,j)*31))+1;
        }

        return res;
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