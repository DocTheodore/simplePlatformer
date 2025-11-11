// server/index.ts
import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIpAddress } from "../utils/ipaddress.js";

const app = express();
const server = createServer(app);
const io = new Server(server);
const SERVER_PORT = 3000;

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

try{
  server.listen(SERVER_PORT, () => {
    console.clear();
    console.log(`Servidor rodando em http://${getLocalIpAddress()}:${SERVER_PORT}`);
  });
} catch (error) {
  console.error("Erro ao iniciar o servidor:", error);
}