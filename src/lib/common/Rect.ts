import { Vector } from "./Vector";

export class Rect {

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(x: number, y: number, width: number, height: number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    copy(): Rect{
        return new Rect(this.x, this.y, this.width, this.height);
    }

    get midY(){
        return this.y + this.height * 0.5;
    }

    get midX(){
        return this.x + this.width * 0.5;
    }
}

export const collidingResponse = (r1: Rect, r2: Rect) => {
    let dx = r1.midX - r2.midX;
    let dy = r1.midY - r2.midY;
    let aw = (r1.width + r2.width) / 2;
    let ah = (r1.height + r2.height) / 2;

    if(Math.abs(dx) > aw || Math.abs(dy) > ah) return false

    if (Math.abs(dx / r2.width) > Math.abs(dy / r2.height)) {

        if (dx < 0) r1.x = r2.x - r1.width
        else r1.x = r2.x - r1.width;

    } else {

        if (dy < 0) r1.y = r2.y - r1.height; // top
        else r1.y = r2.y + r2.height; // bottom
    }

    return new Vector(r1.midX, r1.midY);
}