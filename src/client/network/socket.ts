//src/client/core/network.socket.ts
import { EntityManager } from "../../shared/ECS/entityManager.js";
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { TileMap } from "../world/tilemapHandler.js";
import { ComponentId } from "../../shared/types/components.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { DirectionStore } from "../../shared/ECS/components/directionStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { SpeedStore } from "../../shared/ECS/components/speedStore.js";

declare const io:any;

export const socket = io(); // Conexão
export let myIp = '';
export let myEntityId: number | undefined = undefined;
export let localPlayers = new Map<string, any>();

export const LocalComponents = new ComponentManager();
export const LocalEntities = new EntityManager(LocalComponents);
export let PlayerLocalEntity: number | undefined = undefined;

// Componentes
const _TransformStore = new TransformStore();
const _VelocityStore = new VelocityStore();
const _DirectionStore = new DirectionStore();
const _InputStore = new InputStore();
const _SpeedStore = new SpeedStore();

LocalComponents.registerComponent(ComponentId.Transform, _TransformStore);
LocalComponents.registerComponent(ComponentId.Velocity, _VelocityStore);
LocalComponents.registerComponent(ComponentId.Direction, _DirectionStore);
LocalComponents.registerComponent(ComponentId.Input, _InputStore);
LocalComponents.registerComponent(ComponentId.Speed, _SpeedStore);

// Eventos do client ================================
socket.on('playerStart', (data: {ip: string, entityId: number}) => {
    console.log(`Server says: ${data.ip, data.entityId}`);

    myIp = data.ip;
    PlayerLocalEntity = data.entityId;;
    LocalEntities.ensure(data.entityId);

    LocalComponents.addComponent(ComponentId.Transform, PlayerLocalEntity);
    LocalComponents.addComponent(ComponentId.Velocity, PlayerLocalEntity);
    LocalComponents.addComponent(ComponentId.Direction, PlayerLocalEntity);
    LocalComponents.addComponent(ComponentId.Input, PlayerLocalEntity);
    LocalComponents.addComponent(ComponentId.Speed, PlayerLocalEntity);

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

        LocalEntities.ensure(id);

        for(const compIdStr in components) {
            const compId = Number(compIdStr);
            const data = components[compId];

            if (data === null) {
                LocalComponents.removeComponent(compId, id);
            } else {
                if(!LocalComponents.hasComponent(compId, id)) {
                    LocalComponents.addComponent(compId, id);
                }

                const store = LocalComponents.getStore<any>(compId);
                const index = store.indexOf(id);
                store.set(index, data);
            }
        }
    }
}