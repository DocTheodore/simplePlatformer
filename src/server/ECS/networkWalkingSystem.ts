
//src/server/ECS/networkWalkingSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { ComponentId, InputMap } from "../../shared/types/components";

export function networkWalkingSystem(manager: ComponentManager) {
    const mask = ComponentId.Direction | ComponentId.Velocity; // Talvez Um componente de aceleração? estatisticas com aceleração e velocidade maxima??
    const entities = manager.query(mask, ComponentId.Direction);

    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);

    for(let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        // Index da entidade
        const indexDir = storeDirection.indexOf(entity);

        /*
        Multiplicar a direção pela variavel de aceleração, até chegar na "velocidade maxima"
        */

        if(true) manager.markDirty(ComponentId.Velocity, entity);
         
    }
}