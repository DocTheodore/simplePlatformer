//src/client/core/controller
import { InputMap } from "../../shared/types/components.js";
import { sendInput } from "../network/socket.js";
import { InputHandler } from "./inputHandler.js";

type keybind = Record<keyof InputMap, string[]>;

export class Controller {
    static keymap = new Map<string, InputMap>();
    private static lastPressed: number = 0;
    private static lastClicked: number = 0;
    private static ready: boolean = false;

    constructor () {}

    // Carrega as informações das teclas no keymap
    static setKeymap(data: keybind) {
        this.keymap.clear();

        for (const action in data) {
            const bit: number = <InputMap>InputMap[action as keyof typeof InputMap];

            for (const key of data[action as keyof typeof data]) {
                Controller.keymap.set(key, bit);
            }
        }
    }

    // Carrega as informações do config.json
    static async init() {
        let keydata: any = undefined;

        try {
            fetch('/config.json').then(resp => {
                resp.json().then(data => {
                    keydata = data.keymap;
                }).catch(err => {
                    console.error(`Json error: ${err}`);
                }).finally(() => {
                    Controller.setKeymap(keydata);
                    Controller.ready = true;
                    //console.log('keydata', Controller.keymap);
                })
                
            }).catch(err => {
                console.error(`HTTP error: ${err}`);
            })

        } catch(err) {
            console.error('Erro ao carregar conteúdo interno', err);
        }
        
    }

    // Pega uma lista de teclas e retorna um bitmask
    static getInputMask(keys: string[]): number {
        let mask = 0;
        for(const key of keys) {
            mask |= Controller.keymap.get(key) ?? 0;
        }
        return mask;
    }

    // Função Update
    static Update() {
        if(!Controller.ready) return

        const pressed = Controller.getInputMask(InputHandler.keyPressed);
        const clicked = Controller.getInputMask(InputHandler.keyClicked);

        if (pressed !== Controller.lastPressed ||
            clicked !== Controller.lastClicked
        ) {
            sendInput(pressed, clicked);
            Controller.lastPressed = pressed;
            Controller.lastClicked = clicked;
        }
    }
}