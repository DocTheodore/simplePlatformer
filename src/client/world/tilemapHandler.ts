// src/client/world/TileMap.ts

import { CHUNK_SIZE } from "../../shared/constants.js";


export class TileMap {
    static chunks = new Map<string, Uint8Array>();

    static setChunk(xChunk: number, yChunk: number, tiles: Uint8Array) {
        const key = `${xChunk}_${yChunk}`;
        const chunkTiles = new Uint8Array(tiles);
        TileMap.chunks.set(key, chunkTiles);
        //console.log("Chunk recebido e armazenado:", TileMap.chunks.get(key)); // debug
    }

    static getTile(worldX: number, worldY: number): number {
        const xChunk = Math.floor(worldX / CHUNK_SIZE);
        const yChunk = Math.floor(worldY / CHUNK_SIZE);
        const key = `${xChunk}_${yChunk}`;

        const chunk = TileMap.chunks.get(key);
        if (!chunk) {
            // console.log("Chunk não carregado ainda:", key);
            return 0; // ar
        }

        // Garante que % funcione com números negativos
        const localX = ((worldX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((worldY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

        const index = localY * CHUNK_SIZE + localX;
        return chunk[index];
    }

    // Opcional: limpar chunks longe do player
    static unloadChunk(xChunk: number, yChunk: number) {
        TileMap.chunks.delete(`${xChunk}_${yChunk}`);
    }
}