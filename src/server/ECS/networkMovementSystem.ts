//src/server/ECS/networkMovementSistem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { ComponentId } from "../../shared/types/components.js";

export function networkMovementSystem(manager: ComponentManager): void {
    const mask = ComponentId.Transform | ComponentId.Velocity;
    const entities = manager.query(mask, ComponentId.Velocity);

    const storeTransform = manager.getStore<TransformStore>(ComponentId.Transform);
    const storeVelocity = manager.getStore<VelocityStore>(ComponentId.Velocity);

    for(let i = 0; i < entities.length; i++ ) {
        const entity = entities[i];

        const indexT = storeTransform.indexOf(entity);
        const indexV = storeVelocity.indexOf(entity);

        const velX = storeVelocity.velX[indexV];
        const velY = storeVelocity.velY[indexV];

        if (velX !== 0 || velY !== 0) {
            storeTransform.posX[indexT] += velX;
            storeTransform.posY[indexT] += velY;
            manager.markDirty(ComponentId.Transform, entity);
        }
    }

}