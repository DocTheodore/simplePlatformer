import { Player } from "../../shared/types.js";
import { TileMap } from "../world/tilemapHandler.js";

declare const io:any;

export const socket = io(); // Conexão
export let ipKey = '';
export let myPlayer:Player | undefined = undefined // temporario
export let localPlayers = new Map<string, Player>();

// Eventos do client ================================
socket.on('hello', (text:string) => {
    console.log(`Server says: ${text}`);
    ipKey = text;
});
socket.on('chunkData', ({ xChunk, yChunk, tiles }: { xChunk: number, yChunk: number, tiles: Uint16Array }) => {
    TileMap.setChunk(xChunk, yChunk, tiles);
    //console.log(TileMap.chunks);
});
socket.on('playerData', (serverData:any) => {
    const {msg, data} = serverData;
    console.log(serverData);
    console.log(msg);
    localPlayers = new Map(Object.entries(data))
    myPlayer = localPlayers.get(ipKey) as Player;
    console.log(localPlayers, myPlayer);
});

// Metodos do client ================================
export const testeNet = () => {
    socket.emit("teste");
}
export const requestChunks = (xChunk:number, yChunk:number, radius:number = 0) => {
    socket.emit("requestChunks", { xChunk, yChunk, radius });
}
export const playerUpdate = (playerData: Player) => {
    //console.log('a');
    socket.emit("requestPlayerUpdate", playerData);
}