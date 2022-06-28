import { LargeNumberLike } from "crypto";
import { MAP_HEIGTH, MAP_WIDTH } from "./const";
import { MapComponent } from "./MapComponent";
import { Rect } from "./Rect";
import { Vector } from "./Vector";

export class Line{
    p1: Vector; 
    p2: Vector; 
    x: number;
    y: number;

    constructor(p1: Vector , p2: Vector){
        this.p1 = p1;
        this.p2 = p2;
        
        this.x = (p1.x + p2.x) / 2;
        this.y = (p1.y + p2.y) / 2;
    }

    get width(){
        return Math.abs(this.p1.x - this.p2.x)
    }

    get height(){
        return Math.abs(this.p1.y - this.p2.y)
    }

}   

export const getObstacleLines = (tileMatrix: MapComponent[][]) => {
    let obstacleLines = [];

    for(let row = 0; row < MAP_HEIGTH; row++){
        for(let col = 0; col < MAP_WIDTH; col++){
            let tile = tileMatrix[row][col];
            
            if(!tile.isObstacle) continue;
            
            let topLeft     = new Vector(tile.x, tile.y)
            let bottomLeft  = new Vector(tile.x, tile.y + tile.heigth);
            let topRight    = new Vector(tile.x + tile.width, tile.y);
            let bottomRight = new Vector(tile.x + tile.width, tile.y + tile.heigth);

            let west  = (row < 0 || row >= 100 || col - 1 < 0 || col - 1 >= 100) ? null : tileMatrix[row][col - 1];
            let east  = (row < 0 || row >= 100 || col + 1 < 0 || col + 1 >= 100) ? null : tileMatrix[row][col + 1];
            let north = (row - 1 < 0 || row - 1 >= 100 || col < 0 || col >= 100) ? null : tileMatrix[row - 1][col];
            let south = (row + 1 < 0 || row + 1 >= 100 || col < 0 || col >= 100) ? null : tileMatrix[row + 1][col];
    
            if(west  && !west.isObstacle)  obstacleLines.push(new Line(topLeft, bottomLeft));
            if(east  && !east.isObstacle)  obstacleLines.push(new Line(topRight, bottomRight));
            if(north && !north.isObstacle) obstacleLines.push(new Line(topLeft, topRight));
            if(south && !south.isObstacle) obstacleLines.push(new Line(bottomRight, bottomLeft));
        }
    }

    return obstacleLines;
}

const lineColliding = (line1: Line, line2: Line) => {
    // http://paulbourke.net/geometry/pointlineplane/javascript.txt
    if((line1.p1.x === line1.p2.x && line1.p1.y === line1.p2.y) || (line2.p1.x === line2.p2.x && line2.p1.y === line2.p2.y)) return false;
     

    let denominator = ((line2.p2.y - line2.p1.y) * (line1.p2.x - line1.p1.x) - (line2.p2.x - line2.p1.x) * (line1.p2.y - line1.p1.y))

    if(denominator === 0) return false;
    

    let ua = ((line2.p2.x - line2.p1.x) * (line1.p1.y - line2.p1.y) - (line2.p2.y - line2.p1.y) * (line1.p1.x - line2.p1.x)) / denominator;
    let ub = ((line1.p2.x - line1.p1.x) * (line1.p1.y - line2.p1.y) - (line1.p2.y - line1.p1.y) * (line1.p1.x - line2.p1.x)) / denominator;

    if(ua <= 0 || ua >= 1 || ub <= 0 || ub >= 1) return false;
    
    let x = line1.p1.x + ua * (line1.p2.x - line1.p1.x);
    let y = line1.p1.y + ua * (line1.p2.y - line1.p1.y);

    return new Vector(x, y);
}

export const linesCollinding = (line: Line, lines: Line[]) => {
    for(let l of lines){
        let intersection = lineColliding(line, l);
        
        if(intersection) return intersection;   
    } 
    return false;
}


