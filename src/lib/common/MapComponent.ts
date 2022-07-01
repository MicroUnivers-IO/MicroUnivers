import { makeNoise2D } from "fast-simplex-noise";
import { makeRectangle } from "fractal-noise";
import { MAP_HEIGTH, MAP_WIDTH, TILE_WIDTH, TILE_HEIGHT, MAP_PIXEL_HEIGHT, MAP_PIXEL_WIDTH } from "./const";
import { Line } from "./Line";
import { Vector } from "./Vector";

export const MAP_COMPONENT_TYPE = Object.freeze({
    LOWGROUND: "LOWGROUND",
    HIGHGROUND: "HIGHGROUND",
    BASEGROUND: "BASEGROUND",
});

export interface MapComponent{
    heigth: number
    width: number
    x: number
    y: number
    type: string
    isObstacle: boolean
    threshold: number
}

const isHighGround = (value: number) => {
    return value > 0.6;
}

const isLowGround = (value: number) => {
    return value < -0.6;
}

const isObstacle = (type: string) => {
    return type === MAP_COMPONENT_TYPE.HIGHGROUND || type === MAP_COMPONENT_TYPE.LOWGROUND;
}

const getComponentType = (value: number) => {
    if(isLowGround(value)) return MAP_COMPONENT_TYPE.LOWGROUND;
    if(isHighGround(value)) return MAP_COMPONENT_TYPE.HIGHGROUND;

    return MAP_COMPONENT_TYPE.BASEGROUND;
}

const getThreshold = (type: string) => {
    if(type === MAP_COMPONENT_TYPE.HIGHGROUND) return 0;
    if(type === MAP_COMPONENT_TYPE.LOWGROUND) return 48;

    return -1;
}

export const createMapComponent = (noiseValue: number, x: number, y: number, height: number, width: number): MapComponent => {
    let type = getComponentType(noiseValue);

    let mc: MapComponent = {
        heigth: height,
        width: width,
        x: x,
        y: y,
        type: type, 
        isObstacle: isObstacle(type),
        threshold: getThreshold(type)
    };

    return mc;
}

export const isVectorInComponent = (c: MapComponent, v: Vector) => {
    return (v.x > c.x && v.x < c.x + c.width) && (v.y > c.y && v.y < c.y + c.heigth);
} 


export const isVectorInComponents = (components: MapComponent[], v: Vector) => {
    let isIn = false;
    for(let component of components)
        if(isVectorInComponent(component, v)) isIn = true
    
    return isIn;
}

export const createMap = () => {
    let tileMatrix: MapComponent[][] = [];
    let spawnableArea: MapComponent[] = [];

    let mapNoise = makeRectangle(MAP_HEIGTH, MAP_WIDTH, makeNoise2D(), {
        octaves: 1,
        amplitude: 1.2,
        frequency: 0.04
    }) as unknown as number[][];

    for(let row = 0; row < MAP_HEIGTH; row++){
        tileMatrix[row] = [];
        for(let col = 0; col < MAP_WIDTH; col++){
            let noiseValue = mapNoise[row][col];
            let mapComp: MapComponent = createMapComponent(noiseValue, col * TILE_WIDTH, row * TILE_HEIGHT, TILE_HEIGHT, TILE_WIDTH);

            if(!mapComp.isObstacle) spawnableArea.push(mapComp);
            
            tileMatrix[row][col] = mapComp;    
        }
    }

    return {
        matrix: tileMatrix,
        spawn: spawnableArea
    };
}

export const getLimitLines = () =>{
    return [
        new Line(new Vector(0,0), new Vector(0, MAP_PIXEL_HEIGHT)), // left
        new Line(new Vector(MAP_PIXEL_WIDTH,0), new Vector(MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT)), //right
        new Line(new Vector(0, 0), new Vector(MAP_PIXEL_WIDTH, 0)), // up
        new Line(new Vector(0,MAP_PIXEL_HEIGHT), new Vector(MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT)) //down
    ];
}

