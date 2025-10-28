console.log('Hello world');

// Var list
let context = document.getElementById("game").getContext("2d");
let fps = {shown: 0, count: 0}

// Game start
function gameStart() {
    context = document.getElementById("game").getContext("2d");
	
	setInterval(function() {
		fps.shown = fps.count;
        fps.count = 0;
        console.log(fps.shown);
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