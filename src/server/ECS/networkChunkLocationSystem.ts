//src/server/ECS/networkChunkLocationSystem.ts
import { CHUNK_SIZE } from "../../shared/constants.js";
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { ChunkStore } from "../../shared/ECS/components/chunkStore.js";
import { NetworkStore } from "../../shared/ECS/components/networkStore.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { ComponentId, NetScope } from "../../shared/types/components.js";
import { WorldManager } from "../world/world.js";

export function networkChunkLocationSystem(manager: ComponentManager, world: WorldManager, localChunkEntities: Map<string, Set<number>>): void {
    const mask = ComponentId.Transform | ComponentId.Chunk | ComponentId.Network;
    const entities = manager.query(mask, ComponentId.Chunk);

    const storeTransform = manager.getStore<TransformStore>(ComponentId.Transform);
    const storeChunk = manager.getStore<ChunkStore>(ComponentId.Chunk);
    const storeNetwork = manager.getStore<NetworkStore>(ComponentId.Network);

    for(let i = 0; i < entities.length; i++ ) {
        const entity = entities[i];

        const indexT = storeTransform.indexOf(entity);
        const indexC = storeChunk.indexOf(entity);
        const indexN = storeNetwork.indexOf(entity);

        const newChunkX = Math.floor(storeTransform.posX[indexT] / CHUNK_SIZE);
        const newChunkY = Math.floor(storeTransform.posY[indexT] / CHUNK_SIZE);

        const oldChunkX = storeChunk.chunkX[indexC];
        const oldChunkY = storeChunk.chunkY[indexC];
        const localScope = storeNetwork.scope[indexN] === NetScope.Local;

        if(newChunkX !== oldChunkX || newChunkY !== oldChunkY) {
            // Atualizar o componente
            storeChunk.chunkX[indexC] = newChunkX;
            storeChunk.chunkY[indexC] = newChunkY;
            manager.markDirty(ComponentId.Chunk, entity);

            // Atualizar o localChunkEntities
            if (localScope) {
                const oldKey = `${oldChunkX}_${oldChunkY}`;
                const newKey = `${newChunkX}_${newChunkY}`;

                if(localChunkEntities.has(oldKey)) localChunkEntities.get(oldKey)!.delete(entity);
                if(!localChunkEntities.has(newKey)) localChunkEntities.set(newKey, new Set());
                localChunkEntities.get(newKey)!.add(entity);
            }

            // Garantir que o chunk fique ativo
            world.getChunk(newChunkX, newChunkY);
        }
    }
}