//src/server/ECS/networkMovementSistem.ts
import { EntityManager } from "../../shared/classes/entity.js";
import { C } from "../../shared/types/components.js";

export function networkMovementSystem(entities: EntityManager): void {
    const movementEntities = entities.query(C.Position, C.Velocity, C.Facing, C.OnGround, C.Stats);

    for(const [id, component] of movementEntities) {
        const pos = component[C.Position];
        const vel = component[C.Velocity];
        const stats = component[C.Stats];

        // Teste individual        
        vel.x = stats.speed;
        pos.x += vel.x;

        console.log('Velocity', id, component[C.Velocity]);
        console.log('Position' ,id, component[C.Position]);    
        console.log(' ')

    }

    console.log(JSON.stringify(movementEntities));

}