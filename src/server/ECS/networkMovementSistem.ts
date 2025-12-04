import { GameEntities } from "../../shared/classes/entity.js";
import { C } from "../../shared/types/components.js";

export function networkMovementSystem(entities: GameEntities): void {
    const movementEntities = entities.query(C.Position, C.Velocity, C.Facing, C.OnGround);

    for(const [id, component] of movementEntities) {
        // Teste individual
        console.log(id, component[C.Position]);    
        console.log(id, component[C.Velocity]);
        console.log(' ')
        
        component[C.Velocity].y = 5;
        component[C.Position].y += component[C.Velocity].y; 
        component[C.Position].y += component[C.Velocity].y; 
        component[C.Position].y += component[C.Velocity].y; 

        console.log(id, component[C.Position]);    
        console.log(id, component[C.Velocity]);
        console.log(' ')

    }

    console.log(JSON.stringify(movementEntities));

}