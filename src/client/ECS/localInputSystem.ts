//src/client/ECS/localInputSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { ComponentId, InputMap } from "../../shared/types/components.js";
import { PlayerLocalEntity } from "../network/socket.js";

export function localInputSystem(manager: ComponentManager) {

    const storeInput = manager.getStore<InputStore>(ComponentId.Input);
    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);

    // Index da entidade
    const indexInp = storeInput.indexOf(PlayerLocalEntity!);
    const indexDir = storeDirection.indexOf(PlayerLocalEntity!);

    // Quais teclas estão sendo apertadas
    const pressed = storeInput.pressed[indexInp];

    // Regras de movimento
    const pressRight = pressed & InputMap.Right
    const pressLeft = pressed & InputMap.Left
    const pressUp = pressed & InputMap.Up // Só para debbug
    const pressDown = pressed & InputMap.Down // Só para debbug

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
        
}