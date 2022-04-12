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

    constructor(w:number = 100, h:number = 100, ts:number = 32) {
        this.tileSize = ts;
        this.width = w;
        this.height = h;
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
        this.mapContainer = new Container();
        let ground = new CompositeRectTileLayer();
        let grass = new CompositeRectTileLayer();
        let bushes = new CompositeRectTileLayer();
        let trees = new CompositeRectTileLayer();

        let mapData = this.perlinGeneration(256, 0.9, 8);
        
        // The tile's x and y position are calculated by multiplying the i and j indexes by the size of a tile.
        // 1 tile = 32px, so (i,j) = (x,y) = (i*32, j*32)
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let mapX:number = j;
                let mapY:number = i;
                let screenX:number =  mapX * this.tileSize;
                let screenY:number =  mapY * this.tileSize;

                let groundTile:number = Math.abs(Math.floor(mapData[mapX][mapY]/256)*32)+1;
                let grassTile:number = Math.abs(Math.floor(mapData[mapX][mapY]/this.width)*16)+1;
                let bushesTile:number = Math.abs(Math.floor(mapData[mapX][mapY]/this.width)*6)+1;
                let treesTile:number = Math.abs(Math.floor(mapData[mapX][mapY]/this.width)*3)+1;

                let tileNb:string = groundTile.toString().padStart(2, '0');
                let tileTexture:string = 'assets/tileset/field_' + tileNb + '.png';
                ground.addFrame(tileTexture, screenX, screenY);

                tileNb = grassTile.toString().padStart(2, '0');
                tileTexture = 'assets/tileset/grass_' + tileNb + '.png';
                grass.addFrame(tileTexture, screenX, screenY);

                tileNb = bushesTile.toString().padStart(2, '0');
                tileTexture = 'assets/tileset/bush_' + tileNb + '.png';
                bushes.addFrame(tileTexture, screenX, screenY);

                tileNb = treesTile.toString().padStart(2, '0');
                tileTexture = 'assets/tileset/trees_' + tileNb + '.png';
                trees.addFrame(tileTexture, screenX, screenY);
            }
        }

        this.mapContainer.addChild(ground);
        this.mapContainer.addChild(grass);
        this.mapContainer.addChild(bushes);
        this.mapContainer.addChild(trees);
    }

    perlinGeneration(size:number, freq:number, oct:number): number[][] {
        let res = new Array(this.width);

        res = makeRectangle(this.width, this.height, 
            function(x:number, y:number): number {
                let noise:Noise2Fn = makeNoise2D();
                return noise(x,y) * (size-1) + 1;
            }, {
                frequency: freq,
                octaves: oct
            });

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