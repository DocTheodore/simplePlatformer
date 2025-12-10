import { EntityManager } from "../../shared/classes/entity.js";
import { Player } from "../../shared/types.js";
import { TileMap } from "../world/tilemapHandler.js";

declare const io:any;

export const socket = io(); // Conexão
export let ipKey = '';
export let myPlayer:Player | undefined = undefined // temporario
export let localPlayers = new Map<string, Player>();

export const LocalEntities = new EntityManager();

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
    const data = serverData;
    localPlayers = new Map(Object.entries(data));
    myPlayer = localPlayers.get(ipKey) as Player;
});
socket.on('fullEntities', (fullSnapshot: any[]) => {
    LocalEntities.clear();
    applyDelta(fullSnapshot);
});
socket.on('deltaEntities', (delta: any[]) => {
    applyDelta(delta);
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

// Funções locais ===================================
function applyDelta(delta: any[]) {
    if(!Array.isArray(delta) || delta.length === 0) return;
    console.log("delta pego: ", delta, LocalEntities)

    for (const change of delta) {
        const {id, $removed, ...components} = change;

        if ($removed) {
            LocalEntities.destroy(id);
            continue;
        }

        if(!LocalEntities.find(id)) {
            LocalEntities.create(id);
        }

        for (const [type, component] of Object.entries(components)) {
            if (component !== undefined) {
                LocalEntities.add(id, type, component);
            } else {
                LocalEntities.remove(id, type);
            }
        }
    }
}