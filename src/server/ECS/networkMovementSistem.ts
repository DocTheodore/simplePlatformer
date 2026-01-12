import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { EntityManager } from "../../shared/ECS/entityManager.js";
import { ComponentId, TransformType } from "../../shared/types/components.js";

//src/server/ECS/networkMovementSistem.ts
export function networkMovementSystem(manager: ComponentManager): void {
    const mask = ComponentId.Transform | ComponentId.Velocity;
    const entities = manager.query(mask, ComponentId.Velocity);

    const storeTransform = manager.getStore(ComponentId.Transform);
    const storeVelocity = manager.getStore(ComponentId.Velocity);

}