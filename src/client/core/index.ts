import { Renderer } from "../rendering/render.js";
import { GameTime } from "./gameTime.js";
import { InputHandler } from "./inputHandler.js";
import { TileMap } from "../world/tilemapHandler.js";
import { requestChunks, testeNet } from "../network/socket.js";
import { TILE_SIZE } from "../../shared/constants.js";
import { WorldRender } from "../rendering/worldRender.js";
import { Camera } from "../rendering/camera.js";

console.log('Hello world');

// Var list
const tileSize = 16;
const windowSize = {
    w:innerWidth,
    h:innerHeight
}
const windowTiles = {
    x:Math.ceil(windowSize.w / tileSize),
    y:Math.ceil(windowSize.h / tileSize),
}
const centerScreen = {
    x: Math.round(windowTiles.x / 2),
    y: Math.round(windowTiles.y / 2),
}

const canvas = document.getElementById("game") as HTMLCanvasElement;
const Player = {
    x:0,
    y:0
};

let context = canvas.getContext("2d");
let fps = {shown: 0, count: 0}

// Funções padrão
function resize() {
    windowSize.w = innerWidth;
    windowSize.h = innerHeight;

    windowTiles.x = Math.ceil(windowSize.w / tileSize);
    windowTiles.y = Math.ceil(windowSize.h / tileSize);

    centerScreen.x = Math.round(windowTiles.x / 2);
    centerScreen.y = Math.round(windowTiles.y / 2);

    if(Renderer.ctx) {
        Renderer.ctx.canvas.width = windowSize.w;
        Renderer.ctx.canvas.height = windowSize.h;
    }
    Renderer.screenSize = windowSize;
}
window.onresize = function() {
    resize();
    Camera.resize(innerWidth, innerHeight);
    console.log(windowSize, windowTiles, centerScreen);
}
window.addEventListener("keydown", (e) => { // função de debbug
    if(e.key === ' ') {
        //WorldRender.render();
    }
    /* 
        tilemapLocal.length = 0;
        TileMap.load();
        let index = 0;

        function formatColor(x:number) {
            return `${(Math.floor((x/160) * 256) % 256).toString(16)}`
        }

        TileMap.tiles.forEach((tile, key) => {
            const [x, y] = key.split('_').map((key) => Number(key));

            const __tile = {
                x: x,
                y: y,
                tileId: tile,
                render: new Renderer(0, {x, y}, {w:1, h:1}, color)
            }
            
            console.log(__tile, tile, `#${formatColor(x)}${formatColor(y)}${(index%256).toString(16)}`);
            tilemapLocal.push(__tile);
            index++;
        });
    } */

    if(e.key === 'a') {
        Player.x -= 16;
    }
    if(e.key === 'd') {
        Player.x += 16;
    }
    if(e.key === 'w') {
        Player.y -= 16;
    }
    if(e.key === 's') {
        Player.y += 16;
    }
})

// Game start
function gameStart() {
    // Renderização do canvas
    context = canvas.getContext("2d") as CanvasRenderingContext2D;
    Renderer.ctx = context;
    
    resize();
    
    // Setup de eventos
    InputHandler.init();
    WorldRender.init(Renderer.ctx);
	
	setInterval(function() {
		fps.shown = fps.count;
        fps.count = 0;
        //console.log(fps.shown);
	}, 1000);
}
function gameLateStart() {
    testeNet();
    for(let x=0; x < 5; x++) {
        for (let y=0; y < 5; y++) {
            requestChunks(x, y)
        }
    }
}

// Game update
function gameUpdate() {
    GameTime.Update();
    
    /* console.log(
        InputHandler.keyPressed,
        InputHandler.keyClicked,
        InputHandler.mousePressed,
        InputHandler.mouseClicked,
    ); */
}
function gameLateUpdate() {
    InputHandler.lateUpdate();

}

// Game Render
function gameRender() {
    Renderer.Clear();

    Camera.follow(Player);

    WorldRender.render();
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