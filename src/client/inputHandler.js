class InputHandler {
    static mousePos = {x: 0, y:0};
    static mousePressed = [];
    static mouseClicked = [];
    static tileSize = 16;

    static keyPressed = [];
    static keyClicked = [];

    constructor () {}

    static init() {
        // Eventos do Mouse
        document.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
        document.addEventListener('mousemove', (ev) => {
            const targetPosY = ev.clientY;
            const targetPosX = ev.clientX;

            InputHandler.mousePos.x = targetPosX;
            InputHandler.mousePos.y = targetPosY;
            
            //console.log(InputHandler.tilePos, InputHandler.tileX, InputHandler.tileY);
        });
        document.addEventListener('mousedown', (ev) => {
            if(!InputHandler.mousePressed.some(button => button === ev.button)) {
                InputHandler.mousePressed.push(ev.button);
                InputHandler.mouseClicked.push(ev.button);
            }
        });
        document.addEventListener('mouseup', (ev) => {
            if(InputHandler.mousePressed.some(button => button === ev.button)) {
                const index = InputHandler.mousePressed.indexOf(ev.button);
                InputHandler.mousePressed.splice(index, 1);
            }
        });

        // Eventos das Teclas
        document.addEventListener('keydown', (ev) => {
            if(!InputHandler.keyPressed.some(key => key === ev.key)) {
                InputHandler.keyPressed.push(ev.key);
                InputHandler.keyClicked.push(ev.key);
            }
        });
        document.addEventListener('keyup', (ev) => {
            if(InputHandler.keyPressed.some(key => key === ev.key)) {
                const index = InputHandler.keyPressed.indexOf(ev.key);
                InputHandler.keyPressed.splice(index, 1);
            }
        });
    }

    static lateUpdate() {
        InputHandler.mouseClicked = [];
        InputHandler.keyClicked = [];
    }

    // Metodos Get
    static get mouseX() { return InputHandler.mousePos.x }
    static get mouseY() { return InputHandler.mousePos.y }

    static get tilePos() { 
        return {
            x: Math.ceil(InputHandler.mouseX / InputHandler.tileSize),
            y: Math.ceil(InputHandler.mouseY / InputHandler.tileSize),
        }
    }
    static get tileX() { return InputHandler.tilePos.x }
    static get tileY() { return InputHandler.tilePos.y }
}