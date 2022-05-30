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
}