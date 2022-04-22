export function moveEntity(directions: boolean[], speed:number):number[]{
    let movementVector: number[] = [0, 0];
		
		if(directions[0]) {
			movementVector[1] += 1;
		}
		if(directions[1]) {
			movementVector[1] -= 1;
		}
		if(directions[2]) {
			movementVector[0] += 1;
		}
		if(directions[3]) {
			movementVector[0] -= 1;
		}

		let movementMagnitude:number = Math.sqrt(movementVector[0] * movementVector[0] + movementVector[1] * movementVector[1]);
		
        if(movementMagnitude != 0) {
			movementVector = [(movementVector[0] / movementMagnitude) * speed,
							(movementVector[1] / movementMagnitude) * speed];
        }

        return movementVector;
}

