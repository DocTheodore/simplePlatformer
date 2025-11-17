import { Renderer } from "./render.js";
import { GameTime } from "./gameTime.js";
import { InputHandler } from "./inputHandler.js";
import { TileMap, tile } from "./tilemapHandler.js";
import { requestChunks, testeNet } from "./network/socket.js";

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
const tilemapLocal:tile[] = [];
const localCord = {x:0, y:0};

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
    console.log(windowSize, windowTiles, centerScreen);
}
window.addEventListener("keydown", (e) => { // função de debbug
    if(e.key === ' ') {
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
                render: new Renderer(0, {x, y}, {w:1, h:1}, `#${formatColor(x)}${formatColor(y)}${(index%256).toString(16)}`)
            }
            
            console.log(__tile, tile, `#${formatColor(x)}${formatColor(y)}${(index%256).toString(16)}`);
            tilemapLocal.push(__tile);
            index++;
        });
    }

    if(Renderer.ctx) {
        if(e.key === 'a') {
            Renderer.offSetX -= 16;
        }
        if(e.key === 'd') {
            Renderer.offSetX += 16;
        }
        if(e.key === 'w') {
            Renderer.offSetY -= 16;
        }
        if(e.key === 's') {
            Renderer.offSetY += 16;
        }
    }
})

// Game start
function gameStart() {
    // Renderização do canvas
    context = canvas.getContext("2d");
    Renderer.ctx = context;
    resize();

    // Setup de eventos
    InputHandler.init();
    /* TileMap.init().then(() => {
        //console.log(TileMap.fileData);
        TileMap.tiles.forEach((line:any, y:number) => {
            line.forEach((col:any, x:number) => {
                const tile = {
                    x: x,
                    y: y,
                    tileId: col,
                    render: new Renderer(0, {x, y}, {w:1, h:1}, col? '#999' : '#000')
                }
                //console.log(tile);
                //tilemapLocal.push(tile);
            });
        });
    }); */
	
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
//const teste = new Renderer(1, centerScreen, {w:1, h:2});
function gameRender() {
    Renderer.Clear();
    
    tilemapLocal.forEach((tile) => {
        tile.render.Tile();
    })
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