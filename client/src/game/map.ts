import { BaseTexture, Container, Texture } from "pixi.js";
import { CompositeRectTileLayer } from "@pixi/tilemap";

export class GameMap {
    private mapContainer: Container;
    private ground: CompositeRectTileLayer;
    private tileSize: number;
    private width: number;
    private height: number;
    private data:number[][];

    constructor(data:number[][], ts:number = 32, w:number = 100, h:number = 100) {
        this.data = data;
        this.tileSize = ts;
        this.width = w;
        this.height = h;
    }

    generateView(screenWidth: number, screenHeight: number) {
        let tileAtPos:number;
        let tileTexture:string;
        let mapX:number;
        let mapY:number;
        let screenX:number;
        let screenY:number;

        this.mapContainer = new Container();
        this.ground = new CompositeRectTileLayer();        

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                mapX = j;
                mapY = i;
                screenX =  mapX * this.tileSize;
                screenY =  mapY * this.tileSize;
                console.log(mapX, mapY, screenX, screenY);

                if(mapX < 0 || mapY < 0 || mapX >= 100 || mapY >= 100)
                    continue;

                tileAtPos = this.data[mapX][mapY];
                tileTexture = 'assets/tileset/field_' + tileAtPos.toString().padStart(2, '0') + '.png';
                this.ground.addFrame(tileTexture, screenX, screenY);
            }
        }
        this.mapContainer.addChild(this.ground);
    }

    getView() {
        return this.mapContainer;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}