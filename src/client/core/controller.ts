//src/client/core/controller
import { INPUT, PLAYER } from "../../shared/constants.js";
import { checkTileCollision } from "../../shared/functions/collision.js";
import { socket } from "../network/socket.js";
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
    static ActionList:number[] = []

    private constructor () {}

    private static sendAction(actionId:number) : void {

        const action:{actionId: number} = {
            actionId: actionId,
        }

        socket.emit("playerAction", action);
    }

    static Update() {
        //if (!myPlayer) return;

        const SPEED = 10;
        const w = PLAYER.WIDTH, h = PLAYER.HEIGHT;

        let moved = false;
        //const newPos = { x: myPlayer.Movement.pos.x, y: myPlayer.Movement.pos.y };
        const newPos = { x: 0, y: 0 };

        if (InputHandler.keyPressed.includes(Controller.InputConfig.UP)) {
            newPos.y -= SPEED;
            Controller.sendAction(INPUT.UP);
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.DOWN)) {
            newPos.y += SPEED;
            Controller.sendAction(INPUT.DOWN);
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.LEFT)) {
            newPos.x -= SPEED;
            Controller.sendAction(INPUT.LEFT);
            moved = true;
        }
        if (InputHandler.keyPressed.includes(Controller.InputConfig.RIGHT)) {
            newPos.x += SPEED;
            Controller.sendAction(INPUT.RIGHT);
            moved = true;
        }

        if (!moved) return;

        // Client-side collision (previsão)
        const getTile = (worldX: number, worldY: number): number | null => {
            const tile = TileMap.getTile(worldX, worldY);
            return tile ?? null;
        };

        /* 
        // Testa X primeiro
        if (!checkTileCollision(newPos.x, myPlayer.Movement.pos.y, w, h, getTile)) {
            myPlayer.Movement.pos.x = newPos.x;
        }
        // Testa Y
        if (!checkTileCollision(myPlayer.Movement.pos.x, newPos.y, w, h, getTile)) {
            myPlayer.Movement.pos.y = newPos.y;
        } */

        // Suavização visual
        //socket.emit("requestPlayerUpdate", myPlayer);
    }
}