export function moveEntity(up:boolean, down:boolean, left:boolean, right:boolean, speed:number):number[]{
    let movementVector: number[] = [0, 0];
		
		if(up) {
			movementVector[1] += 1;
		}
		if(down) {
			movementVector[1] -= 1;
		}
		if(left) {
			movementVector[0] += 1;
		}
		if(right) {
			movementVector[0] -= 1;
		}

		let movementMagnitude:number = Math.sqrt(movementVector[0] * movementVector[0] + movementVector[1] * movementVector[1]);
		
        if(movementMagnitude != 0) {
			movementVector = [(movementVector[0] / movementMagnitude) * speed,
							(movementVector[1] / movementMagnitude) * speed];
        }

        return movementVector;
}

