
import { AStarFinder, DiagonalMovement, FinderOptions, Grid } from "pathfinding";
import { Vector } from "../../lib/common/Vector";
import { Entity } from "../../lib/types/Entity";
import { Player } from "../../lib/types/Player";


export class ServEntity implements Entity{

    static matrix: number[][];
    static count: number = 0;
    static maxSpeed = 10;
    static maxForce = 1;

    id: number;
    x: number;
    y: number;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;

    constructor(x: number, y: number){
        this.id = ServEntity.count++
        this.x = x;
        this.y = y;
        
        this.position = new Vector(this.x, this.y);
        // console.log(`position : ${this.position.x} ${this.position.x}`)
        this.velocity = new Vector((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        
        this.acceleration = new Vector();
    } 

    edges() {
        let width = 3200;
        let height = 3200;

        if (this.position.x > width) {
            this.position.x = width;
            this.x = width;
            this.velocity.invertX();
        } else if (this.position.x < 0) {
            this.position.x = 0;
            this.x = 0;
            this.velocity.invertX();
        }
        if (this.position.y > height) {
            this.position.y = height;
            this.y = height;
            this.velocity.invertY();
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.y = 0;
            this.velocity.invertY();
        }
    }

    align(boids: ServEntity[]){
        let perceptionRadius = 50;
        let steering = new Vector();

        let total = 0;
        for (let other of boids) {
            let dist = this.position.distance(other.position);
            if (other.id != this.id && dist < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total)
            .setMag(ServEntity.maxSpeed)
            .sub(this.velocity)
            .limit(ServEntity.maxForce)
        }
        // console.log(`steering: x = ${steering.x} y = ${steering.y}`);
        return steering;
    } 

    separation(boids: ServEntity[]) {
        let perceptionRadius = 20;
        let steering = new Vector();

        let total = 0;
        for (let other of boids) {
            let dist = this.position.distance(other.position);

            if (other.id != this.id && dist < perceptionRadius) {
                let diff = new Vector(this.position.x - other.position.x, this.position.y - other.position.y) ;
                diff.div(dist**2);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total)
            .setMag(ServEntity.maxSpeed)
            .sub(this.velocity)
            .limit(ServEntity.maxForce);
        }
        return steering;
    }

    cohesion(boids: ServEntity[]) {
        let perceptionRadius = 50;
        let steering = new Vector();
        
        let total = 0; 
        for (let other of boids) {
            let dist = this.position.distance(other.position);

            if (other.id != this.id && dist < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total)
            .sub(this.position)
            .setMag(ServEntity.maxSpeed)
            .sub(this.velocity)
            .limit(ServEntity.maxForce);
        }
        return steering;
    }

    alignToNearestPlayer(players: Player[]){
        let perceptionRadius = 1000; 
        let steering = new Vector();

        let minDist: number;
        let nearestPlayer: Player | undefined;
        
        players.forEach(player => { 
            let dist = Math.sqrt( (this.x - player.x)**2 + (this.y - player.y)**2);

            if((dist < minDist || !minDist) && dist < perceptionRadius){
                minDist = dist;
                nearestPlayer = player;
            }
        })

        if(!nearestPlayer) return steering;

        steering.add(new Vector(nearestPlayer.x, nearestPlayer.y))
        .sub(this.position)
        .setMag(ServEntity.maxSpeed)
        .add(this.velocity)
        .limit(ServEntity.maxForce + 10);

        return steering;
    }

    flock(boids: ServEntity[], players: Player[]){
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let playerAlignment = this.alignToNearestPlayer(players);


        separation.mult(5);

        this.acceleration
        .add(alignment)
        .add(cohesion)
        .add(separation)
        .add(playerAlignment)
    }


    update(boids: ServEntity[], players: Player[]){
        this.edges(); 
        this.flock(boids, players);
        // console.log(`adding velocity to position : ${this.position.x} ${this.position.y} ${this.velocity.x} ${this.velocity.x}`);
        this.position.add(this.velocity);
        this.x = this.position.x;
        this.y = this.position.y;
        this.velocity.add(this.acceleration);
        this.velocity.limit(ServEntity.maxSpeed);
        this.acceleration.mult(0);
        
        // console.log(`x: ${this.x} - y: ${this.y}`);
    }

}
    