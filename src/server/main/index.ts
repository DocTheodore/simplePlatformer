// server/index.ts
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIpAddress } from "../../shared/utils/ipaddress.js";
import { WorldManager } from "../world/world.js";

const app = express();
const server = createServer(app);
const io = new Server(server, { "pingInterval": 2000, "pingTimeout": 10000 });
const SERVER_PORT = 3000;

const World = new WorldManager();

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
  socket.emit("hello", "...");
  const clientIp = socket.handshake.address.split('::ffff:')[1]

  socket.on("teste", () => {
    console.log("Ouvindo cliente", clientIp);
  })

  socket.on("requestChunks", (data:{xChunk:number, yChunk:number, radius:number}) => {
    const{xChunk, yChunk, radius} = data;
    for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      const cx = xChunk + dx;
      const cy = yChunk + dy;
      const tiles = World.getChunk(cx, cy);
      io.emit("chunkData", {xChunk: cx, yChunk: cy, tiles});
    }
    }

  });

  // Lidar com a desconexão
  socket.on("disconnect", () => {
    console.log("Cliente desconectado", clientIp);
  })
});

try{
  server.listen(SERVER_PORT, () => {
    console.clear();
    console.log(`Servidor rodando em http://${getLocalIpAddress()}:${SERVER_PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}