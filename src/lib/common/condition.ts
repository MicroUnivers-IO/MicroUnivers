export const isHighGround = (value: number) => {
    return value > 1;
}

export const isLowGround = (value: number) => {
    return value < -1;
}

export const isObstacle = (value: number) => {
    return isHighGround(value) || isLowGround(value);
}