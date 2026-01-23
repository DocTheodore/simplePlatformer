
//src/server/ECS/networkSpeedSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { SpeedStore } from "../../shared/ECS/components/speedStore.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { ComponentId } from "../../shared/types/components.js";

export function networkSpeedSystem(manager: ComponentManager) {
    const mask = ComponentId.Direction | ComponentId.Velocity | ComponentId.Speed; // Talvez Um componente de aceleração? estatisticas com aceleração e velocidade maxima??
    const entities = manager.query(mask, ComponentId.Speed);

    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);
    const storeVelocity = manager.getStore<VelocityStore>(ComponentId.Velocity);
    const storeSpeed = manager.getStore<SpeedStore>(ComponentId.Speed);

    for(let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        // Index da entidade
        const indexDir = storeDirection.indexOf(entity);
        const indexVel = storeVelocity.indexOf(entity);
        const indexSpd = storeSpeed.indexOf(entity);

        // Campos dos componentes
        const accel = storeSpeed.acceleration[indexSpd];
        const topSpeed = storeSpeed.topSpeed[indexSpd];
        const friction = storeSpeed.friction[indexSpd];

        const dirX = storeDirection.dirX[indexDir];
        const dirY = storeDirection.dirY[indexDir]; // Só para debbug
        const currentVelX = storeVelocity.velX[indexVel];
        const currentVelY = storeVelocity.velY[indexVel]; // Só para debbug

        const canAccel = (dirX > 0 && currentVelX < topSpeed) || (dirX < 0 && currentVelX > -topSpeed);
        const canAccelDebbug = (dirY > 0 && currentVelY < topSpeed) || (dirY < 0 && currentVelY > -topSpeed);

        // Mudar a velocidade conforme a direção
        if(dirX) {
            if (canAccel) {
                storeVelocity.velX[indexVel] = currentVelX + dirX * accel;
            }
        }
        if (!dirX || !canAccel) {
            if (currentVelX > 0) {
                const diff = currentVelX - friction;
                storeVelocity.velX[indexVel] = (diff > 0) ? diff : 0;
            }
            if (currentVelX < 0) {
                const diff = currentVelX + friction;
                storeVelocity.velX[indexVel] = (diff < 0) ? diff : 0; 
            }
        }

        // Só para debbug !!!!!!
        if(dirY) {
            if (canAccelDebbug) {
                storeVelocity.velY[indexVel] = currentVelY + dirY * accel;
            }
        }
        if (!dirY || !canAccelDebbug) {
            if (currentVelY > 0) {
                const diff = currentVelY - friction;
                storeVelocity.velY[indexVel] = (diff > 0) ? diff : 0;
            }
            if (currentVelY < 0) {
                const diff = currentVelY + friction;
                storeVelocity.velY[indexVel] = (diff < 0) ? diff : 0; 
            }
        }


        // Registrar mudanças
        if(storeVelocity.velX[indexVel] !== currentVelX
            || storeVelocity.velY[indexVel] !== currentVelY // Só para debbug
        ) manager.markDirty(ComponentId.Velocity, entity);
         
    }
}