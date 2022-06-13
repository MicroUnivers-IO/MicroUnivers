import { Vector } from "../../lib/common/Vector";
import { Entity } from "../../lib/types/Entity";
import { getLimitLines } from "../../lib/common/MapComponent";
import { Player } from "../../lib/types/Player";
import { QuadTree } from "../../lib/common/Quadtree";
import { MAP_PIXEL_HEIGHT, MAP_PIXEL_WIDTH } from "../../lib/common/const";
import { addAngle, degreeToRad } from "../../lib/common/utils";
import { Line, linesCollinding } from "../../lib/common/Line";


export class ServEntity implements Entity{

    static RADIUS_ALIGN = 50;
    static RADIUS_SEPARATION = 50;
    static RADIUS_COHESION = 50;
    static RADIUS_PLAYER = 300;
    static RADIUS_OBSTACLE = 50;
    static RADIUS_OF_VIEW = 270;


    static MAX_ITEMS = 20;

    static count: number = 0;
    static maxSpeed = 10;
    static maxForce = 1;

    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;

    constructor(x: number, y: number){
        this.id = ServEntity.count++
        
        this.width = 32;
        this.height = 32;

        this.x = x;
        this.y = y;
        this.position = new Vector(x, y);
        this.velocity = new Vector((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);

        this.acceleration = new Vector();
    } 

    edges() {
        if (this.position.x > MAP_PIXEL_WIDTH) {
            this.position.x = MAP_PIXEL_WIDTH;
            this.velocity.invertX();
        } else if (this.position.x < 0) {
            this.position.x = 0;
            this.velocity.invertX();
        }
        if (this.position.y > MAP_PIXEL_HEIGHT) {
            this.position.y = MAP_PIXEL_HEIGHT;
            this.velocity.invertY();
        } else if (this.position.y < 0) {
            this.position.y = 0;
            this.velocity.invertY();
        }
    }

    align(entitysQuadTree: QuadTree){
        let steering = new Vector();
        let others = entitysQuadTree.getItemsInRadius(
            this.x, this.y, ServEntity.RADIUS_ALIGN, ServEntity.MAX_ITEMS
        );

        let total = 0;
        for (let other of others) {
            let dist = this.position.distance(other.position);
            if (other.id != this.id && dist < ServEntity.RADIUS_ALIGN) {
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
        return steering;
    } 
 
    separation(entitysQuadTree: QuadTree) {
        let steering = new Vector();
        let others = entitysQuadTree.getItemsInRadius(
            this.x, this.y, ServEntity.RADIUS_SEPARATION, ServEntity.MAX_ITEMS
        )

        let total = 0;
        for (let other of others) {
            let dist = this.position.distance(other.position);

            if (other.id != this.id && dist < ServEntity.RADIUS_SEPARATION) {
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

    cohesion(entitysQuadTree: QuadTree) {
        let steering = new Vector();

        let others = entitysQuadTree.getItemsInRadius(
            this.x, this.y, ServEntity.RADIUS_COHESION, ServEntity.MAX_ITEMS
        )

        let total = 0; 
        for (let other of others) {
            let dist = this.position.distance(other.position);

            if (other.id != this.id && dist < ServEntity.RADIUS_COHESION) {
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

    targetNearestPlayer(players: Player[]){
        let steering = new Vector();

        let minDist: number;
        let nearestPlayer: Player | undefined;
        
        players.forEach(player => { 
            let dist = this.position.distance(new Vector(player.x, player.y));

            if((dist < minDist || !minDist) && dist < ServEntity.RADIUS_PLAYER){
                minDist = dist;
                nearestPlayer = player;
            }
        });

        if(!nearestPlayer) return steering;

        steering.add(new Vector(nearestPlayer.x, nearestPlayer.y))
        .sub(this.position)
        .setMag(ServEntity.maxSpeed)
        .add(this.velocity)
        .limit(ServEntity.maxForce);

        return steering;
    }

    collisionAvoidance(obstaclesQuadtree: QuadTree){        
        let obstacles = obstaclesQuadtree.getItemsInRadius(this.x, this.y, ServEntity.RADIUS_OBSTACLE, ServEntity.MAX_ITEMS) as Line[];
        obstacles.push(...getLimitLines());  //ajoute les 4 bordures de la map

        let movVec = this.position.copy().add(this.velocity);
        let baseAngle = this.position.getAngle(movVec);
        let start = addAngle(baseAngle, -(degreeToRad(ServEntity.RADIUS_OF_VIEW) / 2));

        let baseVec = this.position.circlePoint(baseAngle, ServEntity.RADIUS_OBSTACLE);
        let firstIntersection = linesCollinding(this.position, baseVec, obstacles);
        if(!firstIntersection) return null;

        let separation = 2;
        let steps = Math.round(ServEntity.RADIUS_OF_VIEW / separation);
        let currentAngle = start;
        let directions: Vector[] = [];
        for(let i = 0; i < steps; i++){
            directions.push(this.position.circlePoint(currentAngle, ServEntity.RADIUS_OBSTACLE)); 
            currentAngle = addAngle(currentAngle, degreeToRad(separation));
        }
        
        directions.sort((a: Vector, b: Vector) => {
            return a.distance(movVec)  - b.distance(movVec);
        });
        
        for(let i = 0; i < directions.length; i++){
            let intersection = linesCollinding(this.position, directions[i], obstacles)
            if(intersection) directions[i] = intersection;            
        }

        let bestDir: Vector = directions.reduce((a, b) => { 
            return Math.floor(a.distance(this.position)) >= Math.floor(b.distance(this.position)) ? a : b; 
        });

        this.velocity  = bestDir.sub(this.position).setMag(ServEntity.maxSpeed);
    }

    flock(entitysQuadTree: QuadTree, players: Player[]){                 
        let alignment = this.align(entitysQuadTree);
        let cohesion = this.cohesion(entitysQuadTree);
        let separation = this.separation(entitysQuadTree);
        let target = this.targetNearestPlayer(players);        
        
        separation.mult(2);
        target.mult(20);

        this.acceleration
        .add(alignment)
        .add(cohesion)
        .add(separation)
        .add(target)
    } 

    update(entitysQuadTree: QuadTree, players: Player[], obstaclesQuadtree: QuadTree){                
        this.edges(); 
        this.flock(entitysQuadTree, players);
        this.velocity.add(this.acceleration);
        this.velocity.limit(ServEntity.maxSpeed);
        this.collisionAvoidance(obstaclesQuadtree)
        this.position.add(this.velocity);
        this.acceleration.mult(0); //reset
        this.x = this.position.x;
        this.y = this.position.y;
    }
}
    