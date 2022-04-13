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
    generateView():void {
        this.mapContainer = new Container();
        let ground = new CompositeRectTileLayer();
        let grass = new CompositeRectTileLayer();
        let bushes = new CompositeRectTileLayer();
        let trees = new CompositeRectTileLayer();

        let mapData = this.normalizeData(this.perlinGeneration(32, 0.04, 8));
        
        // The tile's x and y position are calculated by multiplying the i and j indexes by the size of a tile.
        // 1 tile = 32px, so (i,j) = (x,y) = (i*32, j*32)
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let mapX:number = j;
                let mapY:number = i;
                let screenX:number =  mapX * this.tileSize;
                let screenY:number =  mapY * this.tileSize;

                console.log(mapData[mapX][mapY]);

                ground.addFrame(this.randomTile('field', 32), screenX, screenY);

                if(mapData[mapX][mapY] < 0.2) {
                    grass.addFrame(this.randomTile('grass', 16), screenX, screenY);
                }
                if(mapData[mapX][mapY] < 0.05) {
                    trees.addFrame(this.randomTile('trees', 3), screenX, screenY);
                }
                if(mapData[mapX][mapY] < 0.0001) {
                    bushes.addFrame(this.randomTile('bush', 6), screenX, screenY);
                }

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

    normalizeData(data):number[][] {
        let max: number = Math.max.apply(null, data[0]);
        let min: number = Math.min.apply(null, data[0]);

        for (let i = 1; i < this.height; i++) {
            let maxTemp:number = Math.max.apply(null, data[0]);
            let minTemp:number = Math.min.apply(null, data[0]);

            if(maxTemp > max)
                max = maxTemp;
            if(minTemp < min)
                min = minTemp;
        }

        let res = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            res[i] = new Array(this.width);
            for (let j = 0; j < this.width; j++) {
                res[i][j] = (data[i][j] - min) / (max - min);
            }
        }
        return res;
    }

    randomTile(tileCateg:string, maxTile:number):string {
        let tileNb:string = (Math.floor(Math.random() * (maxTile-1))+1).toString().padStart(2, '0');
        let tileTexture:string = 'assets/tileset/'+ tileCateg +'_'+ tileNb +'.png';
        return tileTexture;
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