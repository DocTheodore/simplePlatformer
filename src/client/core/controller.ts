import { INPUT } from "../../shared/constants.js";
import { socket } from "../network/socket.js";
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
        if (!InputHandler) return
        
        if (InputHandler.keyPressed.includes(Controller.InputConfig.UP)) {
            Controller.sendAction(INPUT.UP)
        }        
        if (InputHandler.keyPressed.includes(Controller.InputConfig.DOWN)) {
            Controller.sendAction(INPUT.DOWN)
        }        
        if (InputHandler.keyPressed.includes(Controller.InputConfig.LEFT)) {
            Controller.sendAction(INPUT.LEFT)
        }        
        if (InputHandler.keyPressed.includes(Controller.InputConfig.RIGHT)) {
            Controller.sendAction(INPUT.RIGHT)
        }

    }
}