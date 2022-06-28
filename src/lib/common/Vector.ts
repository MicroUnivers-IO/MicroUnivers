import { runInThisContext } from "vm";
import { Line, linesCollinding } from "./Line";
import { Rect } from "./Rect";

export class Vector{

    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }

    sub(v: Vector){
        this.x -= v.x
        this.y -= v.y
        return this;
    }

    add(v: Vector){
        this.x += v.x
        this.y += v.y
        return this;
    }

    mult(scalar: number){
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    div(scalar: number){
        if(scalar == 0) return this;
        this.x /= scalar;
        this.y /= scalar;
        return this
    }

    invertX(){
        this.x = -this.x;
        return this;
    }

    invertY(){
        this.y = -this.y;
        return this;
    }

    invert(){
        this.invertX();
        this.invertY();
        return this;
    }

    distance(v: Vector){
        let delta = new Vector(this.x - v.x, this.y - v.y);
        return Math.sqrt(delta.x**2 + delta.y**2);
    }

    getMag(){
        return Math.sqrt(this.x**2 + this.y**2);
    }

    setMag(newMag: number){
        let currentMag = this.getMag();
        if(currentMag == 0) return new Vector(0, 0);
        this.x = this.x * newMag / currentMag;
        this.y = this.y * newMag / currentMag;
        return this;
    }

    limit(maxMag: number){
        let currentMag = this.getMag();
        if(currentMag == 0) return new Vector(0 ,0);
        let newMag = Math.min(currentMag, maxMag) / currentMag;
        this.x *= newMag;
        this.y *= newMag;
        return this;
    }

    dotProduct(v: Vector){
        return this.x * v.x + this.y * v.y;
    }

    getAngle(v: Vector){
        let delta = new Vector(
            v.x - this.x, this.y - v.y
        );
        let angle = Math.atan2(delta.y, delta.x);
        
        return angle < 0 ? angle + (Math.PI * 2) : angle;  
    }

    circlePoint(angle: number, radius: number){
        return new Vector(
            (Math.cos(angle) * radius) + this.x,
            Math.abs((Math.sin(angle) * radius) - this.y), //ca marche on touche plus
        );
    }

    copy(){
        return new Vector(this.x, this.y);
    }

    isInTriangle(a: Vector, b: Vector, c: Vector){
        //https://stackoverflow.com/a/20861130
        //pas d'explication dsl
        
        let as_x = this.x - a.x;
        let as_y = this.y - a.y;

        let s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0;

        if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0 == s_ab) return false;
    
        if((c.x-b.x)*(this.y-b.y)-(c.y-b.y)*(this.x-b.x) > 0 != s_ab) return false;
    
        return true;
    }

    handleCollision(obstacles: Line[], hitbox: Rect){
        let up = new Line(new Vector(hitbox.x + this.x, hitbox.y), new Vector(hitbox.x + hitbox.width + this.x, hitbox.y));
        let down = new Line(new Vector(hitbox.x + this.x, hitbox.y + hitbox.height), new Vector(hitbox.x + hitbox.width + this.x, hitbox.y + hitbox.height));

        let left = new Line(new Vector(hitbox.x, hitbox.y - this.y), new Vector(hitbox.x, hitbox.y + hitbox.height - this.y));
        let right = new Line(new Vector(hitbox.x + hitbox.width, hitbox.y - this.y), new Vector(hitbox.x + hitbox.width, hitbox.y + hitbox.height - this.y));

        if(linesCollinding(up, obstacles) || linesCollinding(down, obstacles))
            this.x = 0; 

        if(linesCollinding(left, obstacles) || linesCollinding(right, obstacles))
            this.y = 0;

        return this;
    }
}