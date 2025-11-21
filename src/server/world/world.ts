//server/world/world.ts
import fs from 'fs';
import path from 'path';
import { deflateSync, inflateSync } from 'fflate';
import { fileURLToPath } from 'url';
import { createNoise2D } from "simplex-noise";
import { CHUNK_SIZE } from '../../shared/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurações do mundo
interface WorldConfig {
    name: string;
    seed: number;
    width: number;
    height: number;
}

// Configurações de salvamento
interface TileChange {
    x: number,
    y: number,
    tileId: number,
    playerId: string
}
interface ChunkData {
    tiles: Uint16Array,
    changed: boolean,
    lastAccess: number
}

export class WorldManager {
    // Config
    private config: WorldConfig;
    private filePath: string = '';
    private configPath: string = '';
    private chunkPath: string = '';

    // Chunk config
    private fileCache: Map<string, Uint16Array> = new Map();
    private saveQueue: Map<string, TileChange[]> = new Map();
    private activeChunks: Map<string, ChunkData> = new Map();

    // World config
    constructor(worldName: string = 'teste') {
        // Configuração dos Paths
        this.filePath = path.join(__dirname, `../../../data/worlds/${worldName}`);
        this.configPath = path.join(this.filePath, '/world.json')
        this.chunkPath = path.join(this.filePath, '/chunks')

        // Pegar os meta-dados
        this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
    }

    // === 1. DADOS DE ARQUIVO (.chunk) ===
    private getChunkFilePath(xChunk:number, yChunk:number): string {
        return path.join(this.chunkPath, `${xChunk}_${yChunk}.chunk`);
    }

    private loadChunkFromFile(xChunk: number, yChunk: number): Uint16Array | null {
        const filePath = this.getChunkFilePath(xChunk, yChunk);
        if (!fs.existsSync(filePath)) return null;
        
        const compressed = fs.readFileSync(filePath);
        return inflateSync(compressed) as Uint16Array; // → Uint16Array(1024)
    }

    private saveChunkToFile(xChunk: number, yChunk: number, tiles: Uint16Array) {
        const compressed = deflateSync(tiles, {level: 6}) as Uint16Array;
        const filePath = this.getChunkFilePath(xChunk, yChunk);

        fs.writeFileSync(filePath, compressed);
        const key = `${xChunk}_${yChunk}`;
        this.fileCache.set(key, compressed);
    }

    // === 2. DADOS DE SALVAMENTO (fila de mudanças) ===
    public queueChange(x: number, y: number, tileId: number, playerId: string) {
        const xChunk = Math.floor(x / CHUNK_SIZE);
        const yChunk = Math.floor(y / CHUNK_SIZE);
        const key = `${xChunk}_${yChunk}`;

        const change: TileChange = { x, y, tileId, playerId };
        const queue = this.saveQueue.get(key) || [];
        queue.push(change);
        this.saveQueue.set(key, queue);
    }

    // === 3. DADOS DE REDE (ativo no tick) ===
    public getChunk(xChunk: number, yChunk: number): Uint16Array {
        const key = `${xChunk}_${yChunk}`;
        const now = Date.now();

        // Já está ativo?
        const active = this.activeChunks.get(key);
        if (active) {
            active.lastAccess = now;
            return active.tiles;
        }

        // Carregar do arquivo
        let tiles = this.loadChunkFromFile(xChunk, yChunk);
        if (!tiles) {
            tiles = this.generateChunk(xChunk, yChunk);
            this.saveChunkToFile(xChunk, yChunk, tiles); // salva gerado
        }

        // Aplicar mudanças pendentes
        const pending = this.saveQueue.get(key) || [];
        for (const change of pending) {
            const localX = change.x - xChunk * CHUNK_SIZE;
            const localY = change.y - yChunk * CHUNK_SIZE;
            const index = localY * CHUNK_SIZE + localX;
        if (index >= 0 && index < 1024) {
            tiles[index] = change.tileId;
        }
        }
        this.saveQueue.delete(key); // limpa fila

        // Ativar
        this.activeChunks.set(key, { tiles, changed: false, lastAccess: now });
        return tiles;
    }

    public updateTile(x: number, y: number, tileId: number): boolean {
        const xChunk = Math.floor(x / CHUNK_SIZE);
        const yChunk = Math.floor(y / CHUNK_SIZE);
        const key = `${xChunk}_${yChunk}`;

        const chunk = this.activeChunks.get(key);
        if (!chunk) return false;

        const localX = x - xChunk * CHUNK_SIZE;
        const localY = y - yChunk * CHUNK_SIZE;
        const index = localY * CHUNK_SIZE + localX;

        if (index < 0 || index >= 1024) return false;

        chunk.tiles[index] = tileId;
        chunk.changed = true;
        return true;
    }

    // Geração procedural (simples, como exemplo)
    private generateChunk(xChunk: number, yChunk: number): Uint16Array {
        const tiles = new Uint16Array(CHUNK_SIZE * CHUNK_SIZE);
        const surfaceY = 50;

        for (let y = 0; y < CHUNK_SIZE; y++) {
        for (let x = 0; x < CHUNK_SIZE; x++) {
            const worldX = xChunk * CHUNK_SIZE + x;
            const worldY = yChunk * CHUNK_SIZE + y;
            const index = y * CHUNK_SIZE + x;

            if (worldY > surfaceY + 10) {
                tiles[index] = 3; // pedra
            } else if (worldY > surfaceY + 1) {
                tiles[index] = 2; // terra
            } else if (worldY > surfaceY && worldX % 2) {
                tiles[index] = 1; // grama
            } else if (worldY > surfaceY) {
                tiles[index] = 4; // grama escura
            } else {
                tiles[index] = 0; // ar
            }
        }
        }
        return tiles;
    }

    // === Salvamento automático ===
    public autoSaveChunks() {
        const now = Date.now();
        for (const [key, chunk] of this.activeChunks) {
            if (chunk.changed) {
                const [xChunk, yChunk] = key.split('_').map(Number);
                this.saveChunkToFile(xChunk, yChunk, chunk.tiles);
                chunk.changed = false;
            }

            // Descarregar chunks inativos (> 30s)
            if (now - chunk.lastAccess > 30_000) {
                if (chunk.changed) {
                const [xChunk, yChunk] = key.split('_').map(Number);
                this.saveChunkToFile(xChunk, yChunk, chunk.tiles);
                }
                this.activeChunks.delete(key);
            }
        }
    }

    // Limpeza
    public unloadChunk(xChunk: number, yChunk: number) {
        const key = `${xChunk}_${yChunk}`;
        const chunk = this.activeChunks.get(key);
        if (chunk?.changed) {
            this.saveChunkToFile(xChunk, yChunk, chunk.tiles);
        }
        this.activeChunks.delete(key);
    }
}