export function getDirections(directions: boolean[], key: string, down: boolean): boolean[] {
    switch(key) {
        case "z":
        case "Z":
            directions[0] = down;
            break;
        case "s":
        case "S":
            directions[1] = down;
            break;
        case "q":
        case "Q":
            directions[2] = down;
            break;
        case "d":
        case "D":
            directions[3] = down;
            break;
    }

    return directions;
}