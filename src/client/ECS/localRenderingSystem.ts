//src/server/ECS/localRenderingSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { ComponentId } from "../../shared/types/components.js";
import { EntityRender } from "../rendering/entityRender.js";

export function localRenderingSystem(manager: ComponentManager): void {
    const mask = ComponentId.Transform;
    const entities = manager.query(mask, ComponentId.Transform);

    const storeTransform = manager.getStore<TransformStore>(ComponentId.Transform);

    for(let i = 0; i < entities.length; i++ ) {
        const entity = entities[i];

        const indexT = storeTransform.indexOf(entity);

        const posX = storeTransform.posX[indexT];
        const posY = storeTransform.posY[indexT];

        EntityRender.render(posX, posY, 16, 16, '#FFF');
    }

}