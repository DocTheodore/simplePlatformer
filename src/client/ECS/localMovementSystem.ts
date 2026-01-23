//src/client/ECS/localMovementSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { ComponentId } from "../../shared/types/components.js";
import { PlayerLocalEntity } from "../network/socket.js";

export function localMovementSystem(manager: ComponentManager): void {

    const storeTransform = manager.getStore<TransformStore>(ComponentId.Transform);
    const storeVelocity = manager.getStore<VelocityStore>(ComponentId.Velocity);

    const indexT = storeTransform.indexOf(PlayerLocalEntity!);
    const indexV = storeVelocity.indexOf(PlayerLocalEntity!);

    const velX = storeVelocity.velX[indexV];
    const velY = storeVelocity.velY[indexV];

    if (velX !== 0 || velY !== 0) {
        storeTransform.posX[indexT] += velX;
        storeTransform.posY[indexT] += velY;
    }
}