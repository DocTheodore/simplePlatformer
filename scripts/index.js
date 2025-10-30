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

let context = document.getElementById("game").getContext("2d");
let fps = {shown: 0, count: 0}

// Funções padrão
function resize() {
    windowSize.w = innerWidth;
    windowSize.h = innerHeight;

    windowTiles.x = Math.ceil(windowSize.w / tileSize);
    windowTiles.y = Math.ceil(windowSize.h / tileSize);

    centerScreen.x = Math.round(windowTiles.x / 2);
    centerScreen.y = Math.round(windowTiles.y / 2);

    Renderer.ctx.canvas.width = windowSize.w;
    Renderer.ctx.canvas.height = windowSize.h;
    Renderer.screenSize = windowSize;
}
window.onresize = function() {
    resize();
    console.log(windowSize, windowTiles, centerScreen);
}

// Game start
function gameStart() {
    context = document.getElementById("game").getContext("2d");
    Renderer.ctx = context;
	
	setInterval(function() {
		fps.shown = fps.count;
        fps.count = 0;
        //console.log(fps.shown);
	}, 1000);
}
function gameLateStart() {

}

// Game update
function gameUpdate() {
    GameTime.Update();
    
}
function gameLateUpdate() {

}

// =============================
function main() {
    gameStart();
    gameLateStart();

    const mainLoop = () => {
        gameUpdate();
        gameLateUpdate();

        fps.count++;
        //console.log(fps.count);
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop)
}
main();