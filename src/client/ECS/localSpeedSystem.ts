
//src/client/ECS/localSpeedSystem.ts
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { SpeedStore } from "../../shared/ECS/components/speedStore.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { ComponentId } from "../../shared/types/components.js";
import { PlayerLocalEntity } from "../network/socket.js";

export function localSpeedSystem(manager: ComponentManager) {

    const storeDirection = manager.getStore<DirectionStore>(ComponentId.Direction);
    const storeVelocity = manager.getStore<VelocityStore>(ComponentId.Velocity);
    const storeSpeed = manager.getStore<SpeedStore>(ComponentId.Speed);

    // Index da entidade
    const indexDir = storeDirection.indexOf(PlayerLocalEntity!);
    const indexVel = storeVelocity.indexOf(PlayerLocalEntity!);
    const indexSpd = storeSpeed.indexOf(PlayerLocalEntity!);

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
}