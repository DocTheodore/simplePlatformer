//src/client/core/controller
import { INPUT, PLAYER } from "../../shared/constants.js";
import { checkTileCollision } from "../../shared/functions/collision.js";
import { InputMap } from "../../shared/types/components.js";
import { sendInput, socket } from "../network/socket.js";
import { TileMap } from "../world/tilemapHandler.js";
import { InputHandler } from "./inputHandler.js";

interface InputConfigType {
    UP: string,
    DOWN: string,
    LEFT: string,
    RIGHT: string,
    JUMP: string,
    MOUSE_A: number | number[],
    MOUSE_B: number | number[],
}

const defaultInputConfig:InputConfigType = {
    UP: 'w',
    DOWN: 's',
    LEFT: 'a',
    RIGHT: 'd',
    JUMP: ' ',
    MOUSE_A: 0,
    MOUSE_B: 1,
}

export class Controller {
    static InputConfig:InputConfigType = defaultInputConfig;
    static InputMask:number = 0;

    private constructor () {}

    static Update() {
        //if (!myPlayer) return;

        Controller.InputMask = 0;
        let moved = false;
        //const newPos = { x: 0, y: 0 };

        if (InputHandler.keyPressed.includes(Controller.InputConfig.UP)) {
            Controller.InputMask |= InputMap.Up;
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.DOWN)) {
            Controller.InputMask |= InputMap.Down;
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.LEFT)) {
            Controller.InputMask |= InputMap.Left;
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.RIGHT)) {
            Controller.InputMask |= InputMap.Right;
            moved = true;
        }

        if (!moved) return;
        if (Controller.InputMask > 0) sendInput(Controller.InputMask);

        /*
        // Client-side collision (previsão)
        const getTile = (worldX: number, worldY: number): number | null => {
            const tile = TileMap.getTile(worldX, worldY);
            return tile ?? null;
        };

        // Testa X primeiro
        if (!checkTileCollision(newPos.x, myPlayer.Movement.pos.y, w, h, getTile)) {
            myPlayer.Movement.pos.x = newPos.x;
        }
        // Testa Y
        if (!checkTileCollision(myPlayer.Movement.pos.x, newPos.y, w, h, getTile)) {
            myPlayer.Movement.pos.y = newPos.y;
        } 
        */

        // Suavização visual
        //socket.emit("requestPlayerUpdate", myPlayer);
    }
}