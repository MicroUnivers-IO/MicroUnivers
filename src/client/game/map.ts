import { Container } from "pixi.js";
import { CompositeRectTileLayer } from "@pixi/tilemap";
import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle, Noise2Fn } from 'fractal-noise';

export class GameMap extends Container {
    private tileSize: number;
    private mapData:number[][];
    private columns:number;
    private lines:number;

    constructor(w:number = 100, h:number = 100, ts:number = 32) {
        super();
        this.tileSize = ts;
        this.columns = w;
        this.lines = h;
        this.width = w*ts;
        this.height = h*ts;

        this.mapData = this.normalizeData(this.perlinGeneration(32, 0.04, 25));
    }

    generateView():void {
        let ground = new CompositeRectTileLayer();
        let grass = new CompositeRectTileLayer();
        let bushes = new CompositeRectTileLayer();
        let trees = new CompositeRectTileLayer();
        
        for (let i = 0; i < this.lines; i++) {
            for (let j = 0; j < this.columns; j++) {
                let mapX:number = j;
                let mapY:number = i;
                let screenX:number =  mapX * this.tileSize;
                let screenY:number =  mapY * this.tileSize;

                ground.addFrame(this.randomTile('field', 32), screenX, screenY);

                if(this.mapData[mapX][mapY] < 0.2) {
                    grass.addFrame(this.randomTile('grass', 16), screenX, screenY);
                }
                if(this.mapData[mapX][mapY] < 0.1) {
                    trees.addFrame(this.randomTile('trees', 3), screenX, screenY);
                }
                if(this.mapData[mapX][mapY] < 0.01) {
                    bushes.addFrame(this.randomTile('bush', 6), screenX, screenY);
                }
            }
        }

        this.addChild(ground);
        this.addChild(grass);
        this.addChild(bushes);
        this.addChild(trees);
    }

    perlinGeneration(size:number, freq:number, oct:number): number[][] {
        let res = new Array(this.columns);

        res = makeRectangle(this.columns, this.lines, 
            function(x:number, y:number): number {
                let noise:Noise2Fn = makeNoise2D();
                return noise(x,y) * (size-1) + 1;
            }, {
                frequency: freq,
                octaves: oct
            });

        console.log(res);
        
        return res;
    }

    normalizeData(data: number[][]):number[][] {
        let max: number = Math.max.apply(null, data[0]);
        let min: number = Math.min.apply(null, data[0]);

        for (let i = 1; i < this.lines; i++) {
            let maxTemp:number = Math.max.apply(null, data[i]);
            let minTemp:number = Math.min.apply(null, data[i]);

            if(maxTemp > max)
                max = maxTemp;
            if(minTemp < min)
                min = minTemp;
        }

        let res = new Array(this.lines);
        for (let i = 0; i < this.lines; i++) {
            res[i] = new Array(this.columns);
            for (let j = 0; j < this.columns; j++) {
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

    randomGenerator(){
        return;
    }
}