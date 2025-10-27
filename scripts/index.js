console.log('Hello world');

// Var list
let x = 0

// Game start
function gameStart() {

}
function gameLateStart() {

}

// Game update
function gameUpdate() {
    GameTime.Update();
    console.log(GameTime.delta);
}
function gameLateUpdate() {

}

// =============================
function main() {
    gameStart();
    gameLateStart();

    let x = 0;
    const mainLoop = () => {
        gameUpdate();
        gameLateUpdate();

        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop)
}
main();