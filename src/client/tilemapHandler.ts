import { CHUNK_SIZE, TILE_SIZE } from "../shared/constants.js";
import { requestChunks } from "./network/socket.js";

export interface tile {
    x: number,
    y:number,
    tileId: number | null | undefined,
    render: any
}

export class TileMap {

    static chunks = new Map<string, Uint8Array>();
    static tiles = new Map<string, number>();

    constructor () {}

    static async init () {
        return TileMap.load();
    }

    static async load() {
        try{
            TileMap.chunks.forEach((chunk, key) => {
                const view = new Uint8Array(chunk);
                const [xChunk, yChunk] = key.split('_').map((key) => Number(key));

                view.forEach((tile, i) => {
                    const y = Math.floor(i / CHUNK_SIZE) + yChunk * CHUNK_SIZE;
                    const x = Math.floor(i % CHUNK_SIZE) + xChunk * CHUNK_SIZE;
                    const tileKey = `${x}_${y}`;
                    
                    TileMap.tiles.set(tileKey, tile);
                });
                
                console.log(key, view, xChunk, yChunk);
            })
            console.log(TileMap.tiles);
        } catch(err) {
            console.log("Erro ao carregar o mapa: ", err);
            return null;
        }
    }

    static parseTileMap (text:string) {
        const lines = text.trim().split('\n');
        const tilemap = [];

        for(const line of lines) {
            const row = line.split(',').map(Number);
            tilemap.push(row);
        }

        return tilemap;
    }

    static setChunk(x: number, y: number, tiles: Uint8Array) {
        const key = `${x}_${y}`;
        TileMap.chunks.set(key, tiles);
    }

    static getTile(worldX: number, worldY: number): number {
        const xChunk = Math.floor(worldX / CHUNK_SIZE);
        const yChunk = Math.floor(worldY / CHUNK_SIZE);
        const key = `${xChunk}_${yChunk}`;
        const chunk = TileMap.chunks.get(key);
        if (!chunk) return 0; // ar

        const localX = worldX % CHUNK_SIZE;
        const localY = worldY % CHUNK_SIZE;
        return chunk[localY * CHUNK_SIZE + localX];
    }
}