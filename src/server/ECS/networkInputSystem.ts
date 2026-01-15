//src/server/ECS/networkInputSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { ComponentId, InputMap } from "../../shared/types/components";

export function networkInputSystem(manager: ComponentManager) {
    const mask = ComponentId.Input | ComponentId.Direction;
    const entities = manager.query(mask, ComponentId.Input);

    const storeInput = manager.getStore<InputStore>(ComponentId.Input);
    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);

    for(let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        const indexInp = storeInput.indexOf(entity);
        const indexDir = storeDirection.indexOf(entity);

        const pressed = storeInput.pressed[indexInp];

        if(pressed & InputMap.Right) storeDirection.dirX[indexDir] = 1
        if(pressed & InputMap.Left) storeDirection.dirX[indexDir] = -1
    }
}