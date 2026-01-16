// src/server/main/index.ts
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIpAddress } from "../../shared/utils/ipaddress.js";
import { WorldManager } from "../world/world.js";
import { ClientState } from "../../shared/types.js";
import { EntityManager } from "../../shared/ECS/entityManager.js";
import { ComponentManager } from "../../shared/ECS/componentManager.js";
import { networkMovementSystem } from "../ECS/networkMovementSystem.js";
import { TransformStore } from "../../shared/ECS/components/transformStore.js";
import { ChunkType, ComponentId, InputType, NetworkType, SpriteType, TransformType, VelocityType } from "../../shared/types/components.js";
import { VelocityStore } from "../../shared/ECS/components/velocityStore.js";
import { SpriteStore } from "../../shared/ECS/components/spriteStore.js";
import { networkChunkLocationSystem } from "../ECS/networkChunkLocationSystem.js";
import { ChunkStore } from "../../shared/ECS/components/chunkStore.js";
import { NetworkStore } from "../../shared/ECS/components/networkStore.js";
import { InputStore } from "../../shared/ECS/components/inputStore.js";
import { networkAoiSystem } from "../ECS/networkAoiSystem.js";
import { MIN_CHUNK_RADIUS } from "../../shared/constants.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { "pingInterval": 2000, "pingTimeout": 10000 });
const SERVER_PORT = 3000;

// Gerenciador de clientes
const Clients = new Map<string, ClientState>();

// Gerenciador do estado do Mundo
const NetworkWorld = new WorldManager();
const NetworkComponents = new ComponentManager();
const NetworkEntities = new EntityManager(NetworkComponents);
const GlobalEntities = new Set<number>();
const LocalChunkEntities = new Map<string, Set<number>>();

// Compnentes
const _TransformStore = new TransformStore();
const _VelocityStore = new VelocityStore();
const _SpriteStore = new SpriteStore();
const _ChunkStore = new ChunkStore();
const _NetworkStore = new NetworkStore();
const _InputStore = new InputStore();

NetworkComponents.registerComponent<TransformType>(ComponentId.Transform, _TransformStore);
NetworkComponents.registerComponent<VelocityType>(ComponentId.Velocity, _VelocityStore);
NetworkComponents.registerComponent<SpriteType>(ComponentId.Sprite, _SpriteStore);
NetworkComponents.registerComponent<ChunkType>(ComponentId.Chunk, _ChunkStore);
NetworkComponents.registerComponent<NetworkType>(ComponentId.Network, _NetworkStore);
NetworkComponents.registerComponent<InputType>(ComponentId.Input, _InputStore);

// Diretórios
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const __distDirName = path.join(__dirname, '../../../dist');
const __distDataName = path.join(__dirname, '../../../data');
const __distNodeName = path.join(__dirname, '../../../node_modules');

// Rotas
app.use('/dist', express.static(__distDirName));
app.use('/data', express.static(__distDataName));
app.use('/node_modules', express.static(__distNodeName));
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
    console.log("Página carregada");
});

io.on('connection', (socket) => {
  const clientIp = socket.handshake.address.split('::ffff:')[1]
  const clientEntityId = NetworkEntities.create();

  Clients.set(socket.id, {
    socket: socket,
    entity: clientEntityId,
    chunkX: 0,
    chunkY: 0,
    radius: MIN_CHUNK_RADIUS,
    visible: new Set<number>(),
  });
  GlobalEntities.add(clientEntityId);

  NetworkComponents.addComponent(ComponentId.Transform, clientEntityId);
  NetworkComponents.addComponent(ComponentId.Velocity, clientEntityId);
  NetworkComponents.addComponent(ComponentId.Sprite, clientEntityId);
  NetworkComponents.addComponent(ComponentId.Chunk, clientEntityId);
  NetworkComponents.addComponent(ComponentId.Network, clientEntityId);
  NetworkComponents.addComponent(ComponentId.Input, clientEntityId);


  socket.emit("playerStart", {ip: clientIp, entityId: clientEntityId});

  io.emit("fullEntities", NetworkEntities.getSnapShot() );

  console.log(NetworkEntities.getSnapShot())

  socket.on("teste", () => {
    console.log("Ouvindo cliente", clientIp);
  })

  // Envia os dados de chunk para o jogador
  socket.on("requestChunks", (data:{xChunk:number, yChunk:number, radius:number}) => {
    const{xChunk, yChunk, radius} = data;
    for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const cx = xChunk + dx;
      const cy = yChunk + dy;
      const tiles = NetworkWorld.getChunk(cx, cy);
      socket.emit("chunkData", {xChunk: cx, yChunk: cy, tiles: tiles.buffer}, { binary: true });
    }
    }

  });

  // Atualiza o input do jogador
  socket.on("input", (data: InputType) => {
    const storeInput = NetworkComponents.getStore<InputStore>(ComponentId.Input);
    const IndexInp = storeInput.indexOf(clientEntityId);
    const {pressed, clicked} = data;

    storeInput.clicked[IndexInp] = clicked;
    storeInput.pressed[IndexInp] = pressed;

    NetworkComponents.markDirty(ComponentId.Input, clientEntityId);
  });

  // Lidar com a desconexão ================================
  socket.on("disconnect", () => {
    console.log("Cliente desconectado", clientIp);

    NetworkEntities.destroy(clientEntityId);
    GlobalEntities.delete(clientEntityId);
    Clients.delete(socket.id);

    console.log('Entites Show:');
    console.log(NetworkEntities._Show());
  });
});

// Update loop (Lógica do servidor)
setInterval(() => {
  networkMovementSystem(NetworkComponents);
  networkChunkLocationSystem(NetworkComponents, NetworkWorld, LocalChunkEntities);
  networkAoiSystem(NetworkComponents, Clients, LocalChunkEntities, GlobalEntities);
}, 15);

// Delta loop (Envio de dados para os clients)
setInterval(() => {
  const delta = NetworkEntities.getDelta();

  if (delta.length > 0) {
    io.emit("deltaEntities", delta );
  } 
}, 30);

// Chunk saving loop
setInterval(() => {
    NetworkWorld.autoSaveChunks();
}, 10_000);

try{
  server.listen(SERVER_PORT, () => {
    console.clear();
    console.log(`Servidor rodando em http://${getLocalIpAddress()}:${SERVER_PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}