import { TileMap } from "../tilemapHandler.js";

declare const io:any;

export const socket = io(); // Conexão

// Eventos do client ================================
socket.on('hello', (text:string) => {
    console.log(`Server says: ${text}`);
});
socket.on('chunkData', ({ xChunk, yChunk, tiles }: { xChunk: number, yChunk: number, tiles: Uint8Array }) => {
    console.log(xChunk, yChunk, tiles)
    TileMap.setChunk(xChunk, yChunk, tiles);

    console.log(TileMap.chunks);
});

// Metodos do client ================================
export const testeNet = () => {
    socket.emit("teste");
}

export const requestChunks = (xChunk:number, yChunk:number, radius:number = 2) => {
    socket.emit("requestChunks", {xChunk, yChunk, radius});
}