// src/server/main/index.ts
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIpAddress } from "../../shared/utils/ipaddress.js";
import { WorldManager } from "../world/world.js";
import { __defaultPlayer, Player } from "../../shared/types.js";
import { CHUNK_SIZE, INPUT, PLAYER } from "../../shared/constants.js";
import { checkTileCollision } from "../../shared/functions/collision.js";
import { GameEntities } from "../../shared/classes/entity.js";
import { C } from "../../shared/types/components.js";
import { networkMovementSystem } from "../ECS/networkMovementSistem.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { "pingInterval": 2000, "pingTimeout": 10000 });
const SERVER_PORT = 3000;

// Debug -------
const NetworkPlayers = new Map<string, Player>();

const NetworkWorld = new WorldManager();
const NetworkEntities = new GameEntities();

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
  socket.emit("hello", clientIp);

  NetworkEntities.create(clientIp);
  NetworkEntities.add(clientIp, C.PlayerTag, { });
  NetworkEntities.add(clientIp, C.Position, {x: 0, y: 0});
  NetworkEntities.add(clientIp, C.Velocity, {x: 0, y: 0});
  NetworkEntities.add(clientIp, C.Facing, {left: false});
  NetworkEntities.add(clientIp, C.OnGround, {value: false});

  networkMovementSystem(NetworkEntities);

  const newPlayer = __defaultPlayer
  newPlayer.Stats.color = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
  NetworkPlayers.set(clientIp, newPlayer);
  io.emit("playerData", Object.fromEntries(NetworkPlayers.entries()) );

  socket.on("teste", () => {
    console.log("Ouvindo cliente", clientIp);
  })

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

  socket.on("requestPlayerUpdate", (data:Player) => {
    NetworkPlayers.set(clientIp, data);
    socket.emit("playerData", Object.fromEntries(NetworkPlayers.entries()) );
  });

  socket.on("playerAction", (data) => {
    const { actionId } = data;
    const thisPlayer = NetworkPlayers.get(clientIp);
    networkMovementSystem(NetworkEntities);
    if(!thisPlayer) return 
    
    const Speed = 10;

    let newPos = thisPlayer.Movement.pos;

    if(actionId === INPUT.UP) { newPos.y -= Speed }
    if(actionId === INPUT.DOWN) { newPos.y += Speed }
    if(actionId === INPUT.LEFT) { newPos.x -= Speed }
    if(actionId === INPUT.RIGHT) { newPos.x += Speed }

    const getTile = (worldX: number, worldY: number): number | null => {
        const xChunk = Math.floor(worldX / CHUNK_SIZE);
        const yChunk = Math.floor(worldY / CHUNK_SIZE);
        const chunk = NetworkWorld.getChunk(xChunk, yChunk);
        if (!chunk) { return null }

        // Garante que % funcione com números negativos
        const localX = ((worldX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
        const localY = ((worldY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;

        const index = localY * CHUNK_SIZE + localX;
        return chunk[index];
    }

    // Checar no X
    let collision = checkTileCollision(newPos.x, thisPlayer.Movement.pos.y, PLAYER.WIDTH, PLAYER.HEIGHT, getTile);
    if (!collision) thisPlayer.Movement.pos.x = newPos.x;

    // Checar no Y
    collision = checkTileCollision(thisPlayer.Movement.pos.x, newPos.y, PLAYER.WIDTH, PLAYER.HEIGHT, getTile);
    if (!collision) thisPlayer.Movement.pos.y = newPos.y;

    NetworkPlayers.set(clientIp, thisPlayer);
  })

  // Lidar com a desconexão ================================
  socket.on("disconnect", () => {
    console.log("Cliente desconectado", clientIp);
    NetworkPlayers.delete(clientIp);
    NetworkEntities.destroy(clientIp);
    io.emit("playerData", Object.fromEntries(NetworkPlayers.entries()) );
  });
});

setInterval(() => {
    io.emit("playerData", Object.fromEntries(NetworkPlayers.entries()) );
}, 15);

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