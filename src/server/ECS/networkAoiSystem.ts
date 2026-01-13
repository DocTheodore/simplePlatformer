//src/server/ECS/networkAoiSystem.ts
import { MIN_CHUNK_RADIUS } from "../../shared/constants.js";
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { ChunkStore } from "../../shared/ECS/components/chunkStore.js";
import { ClientState } from "../../shared/types.js";
import { ComponentId } from "../../shared/types/components.js";

export function networkAoiSystem(manager: ComponentManager, clients: Map<string, ClientState>, localChunkEntities: Map<string, Set<number>>, globalEntities: Set<number>) {
    const storeChunk = manager.getStore<ChunkStore>(ComponentId.Chunk);

    for (const client of clients.values()) {
        const entity: number = client.entity;
        const indexC = storeChunk.indexOf(entity);

        const playerChunkX = storeChunk.chunkX[indexC];
        const playerChunkY = storeChunk.chunkY[indexC];
        const playerChunkRadius = client.radius ?? MIN_CHUNK_RADIUS;

        const visible = new Set<number>();

        // Entidades globais
        for(const e of globalEntities) {
            visible.add(e);
        }

        // Entidades locais
        for (let dx = -playerChunkRadius; dx <= playerChunkRadius ; dx++) {
        for (let dy = -playerChunkRadius; dy <= playerChunkRadius ; dy++) {
            const key = `${playerChunkX + dx}_${playerChunkY + dy}`;
            const entities = localChunkEntities.get(key);
            if(!entities) continue;

            for (const e of entities) {
                visible.add(e);
            }
        }    
        }

        client.visible = visible;
    }
}

