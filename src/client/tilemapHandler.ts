import { CHUNK_SIZE } from "../shared/constants.js";

export interface tile {
    x: number,
    y:number,
    tileId: number | null | undefined,
    render: any
}

export class TileMap {

    static fileData:any[] = [];
    static loaded = false;
    static chunks = new Map<string, Uint8Array>();

    constructor () {}

    static async init () {
        return TileMap.load('./data/tilemap_a.txt');
    }

    static async load(filePath:string) {
        try{
            const response = await fetch(filePath)
            if(!response.ok) {
                throw new Error(`Erro de HTTP: ${response.status}`);
            }
            const fileData = await response.text();
            TileMap.fileData = TileMap.parseTileMap(fileData);
            TileMap.loaded = true;
            return response;
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
        this.chunks.set(key, tiles);
    }

    static getTile(worldX: number, worldY: number): number {
        const xChunk = Math.floor(worldX / CHUNK_SIZE);
        const yChunk = Math.floor(worldY / CHUNK_SIZE);
        const key = `${xChunk}_${yChunk}`;
        const chunk = this.chunks.get(key);
        if (!chunk) return 0; // ar

        const localX = worldX % CHUNK_SIZE;
        const localY = worldY % CHUNK_SIZE;
        return chunk[localY * CHUNK_SIZE + localX];
    }
}