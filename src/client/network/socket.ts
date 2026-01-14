//src/client/core/network.socket.ts
import { EntityManager } from "../../shared/ECS/entityManager.js";
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { TileMap } from "../world/tilemapHandler.js";

declare const io:any;

export const socket = io(); // Conexão
export let myIp = '';
export let myEntityId: number | undefined = undefined;
export let localPlayers = new Map<string, any>();

export const LocalComponents = new ComponentManager();
export const LocalEntities = new EntityManager(LocalComponents);
export let PlayerLocalEntity: number | undefined = undefined;

// Eventos do client ================================
socket.on('hello', (data: {ip: string, entityId: number}) => {
    console.log(`Server says: ${data.ip, data.entityId}`);
    myIp = data.ip;
    myEntityId = data.entityId;
    PlayerLocalEntity = LocalEntities.create();
});
socket.on('chunkData', ({ xChunk, yChunk, tiles }: { xChunk: number, yChunk: number, tiles: Uint16Array }) => {
    TileMap.setChunk(xChunk, yChunk, tiles);
    //console.log(TileMap.chunks);
});
socket.on('playerData', (serverData:any) => {
    const data = serverData;
    localPlayers = new Map(Object.entries(data));
});
socket.on('fullEntities', (fullSnapshot: any[]) => {
    applyDelta(fullSnapshot);
    console.log(fullSnapshot);
});
socket.on('deltaEntities', (delta: any[]) => {
    console.log(delta);
    //applyDelta(delta);
});

// Metodos do client ================================
export const testeNet = () => {
    socket.emit("teste");
}
export const requestChunks = (xChunk:number, yChunk:number, radius:number = 0) => {
    socket.emit("requestChunks", { xChunk, yChunk, radius });
}
export const playerUpdate = (playerData: any) => {
    //console.log('a');
    socket.emit("requestPlayerUpdate", playerData);
}
export const sendInput = (pressed: number, clicked: number) => {
    socket.emit("input", {pressed, clicked});
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

    }
}