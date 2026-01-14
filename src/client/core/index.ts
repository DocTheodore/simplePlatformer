// src/client/core/index
import { Renderer } from "../rendering/render.js";
import { GameTime } from "./gameTime.js";
import { InputHandler } from "./inputHandler.js";
import { TileMap } from "../world/tilemapHandler.js";
import { localPlayers, requestChunks, testeNet } from "../network/socket.js";
import { CHUNK_SIZE, PLAYER, TILE_SIZE } from "../../shared/constants.js";
import { WorldRender } from "../rendering/worldRender.js";
import { Camera } from "../rendering/camera.js";
import { EntityRender } from "../rendering/entityRender.js";
import { Controller } from "./controller.js";

console.log('Hello world');

// Var list
const windowSize = {
    w:innerWidth,
    h:innerHeight
}
const windowTiles = {
    x:Math.ceil(windowSize.w / TILE_SIZE),
    y:Math.ceil(windowSize.h / TILE_SIZE),
}
const centerScreen = {
    x: Math.round(windowTiles.x / 2),
    y: Math.round(windowTiles.y / 2),
}

const canvas = document.getElementById("game") as HTMLCanvasElement;
const Player = {
    x: Math.floor(windowSize.w / 2),
    y: Math.floor(windowSize.h / 2),
    w: PLAYER.WIDTH,
    h: PLAYER.HEIGHT,
    chunk: {x: 0, y: 0},
    chunkRadius: Math.ceil((windowTiles.x / CHUNK_SIZE) / 2)
};

let context = canvas.getContext("2d");
let fps = {shown: 0, count: 0}

// Funções padrão
function resize() {
    windowSize.w = innerWidth;
    windowSize.h = innerHeight;

    windowTiles.x = Math.ceil(windowSize.w / TILE_SIZE);
    windowTiles.y = Math.ceil(windowSize.h / TILE_SIZE);

    centerScreen.x = Math.round(windowTiles.x / 2);
    centerScreen.y = Math.round(windowTiles.y / 2);

    if(Renderer.ctx) {
        Renderer.ctx.canvas.width = windowSize.w;
        Renderer.ctx.canvas.height = windowSize.h;
    }
    Renderer.screenSize = windowSize;
    Player.chunkRadius = Math.ceil((windowTiles.x / CHUNK_SIZE) / 2) + 1
}
window.onresize = function() {
    resize();
    Camera.resize(innerWidth, innerHeight);
    console.log(windowSize, windowTiles, centerScreen, Player);
}

function loadVisibleChunks(centerChunkX:number, centerChunkY:number) {
    requestChunks(centerChunkX, centerChunkY, Player.chunkRadius);
}
function unloadFarChunks(centerChunkX:number, centerChunkY:number) {
    const unloadRadius = Player.chunkRadius + 2;

    for(const key of Array.from(TileMap.chunks.keys())) {
        const [cx, cy] = key.split('_').map(Number);
        const distX = Math.abs(cx - centerChunkX);
        const distY = Math.abs(cy - centerChunkY);

        if(distX > unloadRadius || distY > unloadRadius) {
            TileMap.unloadChunk(cx, cy);
        }
    }
}

// Game start
function gameStart() {
    // Renderização do canvas
    context = canvas.getContext("2d") as CanvasRenderingContext2D;
    Renderer.ctx = context;
    
    resize();
    
    // Setup de eventos
    InputHandler.init();
    Controller.init();
    WorldRender.init(Renderer.ctx);
    EntityRender.init(Renderer.ctx);
	
	setInterval(function() {
		fps.shown = fps.count;
        fps.count = 0;
        //console.log(fps.shown);
	}, 1000);
}
function gameLateStart() {
    testeNet();
    
    const WorldX = Math.floor(Player.x / TILE_SIZE);
    const WorldY = Math.floor(Player.y / TILE_SIZE);
    const currChunkX = Math.floor(WorldX / CHUNK_SIZE);
    const currChunkY = Math.floor(WorldY / CHUNK_SIZE);
    loadVisibleChunks(currChunkX, currChunkY);
}

// Game update
function gameUpdate() {
    GameTime.Update();
    Controller.Update();

    /* if(myPlayer) {
        Player.x = myPlayer.Movement.pos.x;
        Player.y = myPlayer.Movement.pos.y;
    } */

    const WorldX = Math.floor(Player.x / TILE_SIZE);
    const WorldY = Math.floor(Player.y / TILE_SIZE);
    const currChunkX = Math.floor(WorldX / CHUNK_SIZE);
    const currChunkY = Math.floor(WorldY / CHUNK_SIZE);

    if(Math.abs(currChunkX - Player.chunk.x) > 0 || Math.abs(currChunkY - Player.chunk.y) > 0) {
        loadVisibleChunks(currChunkX, currChunkY);
        unloadFarChunks(currChunkX, currChunkY);
        Player.chunk = {x: currChunkX, y: currChunkY};
        //console.log(`Novo chunk do player: ${Player.chunk.x}, ${Player.chunk.y}`);
    }
}
function gameLateUpdate() {
    InputHandler.lateUpdate();
    
}

// Game Render
function gameRender() {
    Renderer.Clear();

    // Camera
    Camera.follow(Player, 0.8);

    // Render
    WorldRender.render();
    localPlayers.forEach((player) => {
        EntityRender.render(player.Movement.pos.x, player.Movement.pos.y, Player.w, Player.h, player.Stats.color);
    });
}

// =============================
function main() {
    gameStart();
    setTimeout(() => gameLateStart(), 10);

    const mainLoop = () => {
        gameUpdate();
        gameLateUpdate();

        fps.count++;
        gameRender();
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop)
}
main();