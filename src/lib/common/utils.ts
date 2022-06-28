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

export const isBetweenAngle = (N: number, a: number, b: number) => {
    return (a < b) ? N >= a && N <= b : N >= a || N <= b;
}


export const getDirectionAngle = (direction: string) => {
    //counter clockwise
    switch(direction){
        case "up": return {
            angleA: degreeToRad(0),
            angleB: degreeToRad(180)
        }
        case "left": return {
            angleA: degreeToRad(90),
            angleB: degreeToRad(270)
        }
        case "down": return {
            angleA: degreeToRad(180),
            angleB: degreeToRad(360)
        } 
        case "right": return {
            angleA: degreeToRad(270),
            angleB: degreeToRad(90)
        }             
    }
    throw new Error("no case for this direction");
}