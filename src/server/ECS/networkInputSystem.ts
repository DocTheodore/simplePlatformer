//src/server/ECS/networkInputSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { ComponentId, InputMap } from "../../shared/types/components.js";

export function networkInputSystem(manager: ComponentManager) {
    const mask = ComponentId.Input | ComponentId.Direction;
    const entities = manager.query(mask, ComponentId.Input);

    const storeInput = manager.getStore<InputStore>(ComponentId.Input);
    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);

    for(let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        // Index da entidade
        const indexInp = storeInput.indexOf(entity);
        const indexDir = storeDirection.indexOf(entity);

        // Quais teclas estão sendo apertadas
        const pressed = storeInput.pressed[indexInp];

        // Regras de movimento
        const pressRight = pressed & InputMap.Right
        const pressLeft = pressed & InputMap.Left
        const pressUp = pressed & InputMap.Up // Só para debbug
        const pressDown = pressed & InputMap.Down // Só para debbug

        // Direção atual
        const currentDirX = storeDirection.dirX[indexDir];
        const currentDirY = storeDirection.dirY[indexDir]; // Só para debbug


        if (pressRight ^ pressLeft) {
            if(pressRight) storeDirection.dirX[indexDir] = 1
            if(pressLeft) storeDirection.dirX[indexDir] = -1
        } else {
            storeDirection.dirX[indexDir] = 0
        }

        //Só para debbug
        if (pressDown ^ pressUp) {
            if(pressDown) storeDirection.dirY[indexDir] = 1
            if(pressUp) storeDirection.dirY[indexDir] = -1
        } else {
            storeDirection.dirY[indexDir] = 0
        }

        if(currentDirX !== storeDirection.dirX[indexDir] ||
            currentDirY !== storeDirection.dirY[indexDir] // Só para debbug
        ) manager.markDirty(ComponentId.Direction, entity);
         
    }
}