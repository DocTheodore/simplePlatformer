

export class InputHandler {
    static mousePos = {x: 0, y:0};
    static tileSize = 16;

    static keyPressed:string[] = [];
    static keyClicked:string[] = [];

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
            const key = `mouse${ev.button}`;

            if(!InputHandler.keyPressed.includes(key)) {
                InputHandler.keyPressed.push(key);
                InputHandler.keyClicked.push(key);
            }
        });
        document.addEventListener('mouseup', (ev) => {
            const key = `mouse${ev.button}`;

            if(InputHandler.keyPressed.includes(key)) {
                const index = InputHandler.keyPressed.indexOf(key);
                InputHandler.keyPressed.splice(index, 1);
            }
        });

        // Eventos das Teclas
        document.addEventListener('keydown', (ev) => {
            const key = ev.key.toLowerCase();

            if(!InputHandler.keyPressed.includes(key)) {
                InputHandler.keyPressed.push(key);
                InputHandler.keyClicked.push(key);
            }
        });
        document.addEventListener('keyup', (ev) => {
            const key = ev.key.toLowerCase();

            if(InputHandler.keyPressed.includes(key)) {
                const index = InputHandler.keyPressed.indexOf(key);
                InputHandler.keyPressed.splice(index, 1);
            }
        });
    }

    static lateUpdate() {
        InputHandler.keyClicked.length = 0;
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