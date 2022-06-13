import { MapComponent } from "./MapComponent";
import { Vector } from "./Vector";

export const addAngle = (a: number, b: number) => {
    let newAngle = a + b;
    return newAngle < 0 ? newAngle + (Math.PI * 2) : newAngle % (Math.PI * 2);
}

export const radToDegree = (rad: number) => {
    return rad * (180 / Math.PI);
}

export const degreeToRad = (degree: number) => {
    return degree * (Math.PI / 180);
}

export const roundTo2ndDecimal = (n: number) => {
    return Math.round(n * 100) / 100;
}