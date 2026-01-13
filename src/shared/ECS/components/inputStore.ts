//Shared/ECS/components/InputStore.ts
import { TypedArray } from "../../types.js";
import { InputType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class InputStore extends ComponentStore<InputType> {
    protected capacity: number = 16;
    protected fields: TypedArray[] = [];

    // Proprieades
    pressed: Uint32Array;
    clicked: Uint32Array;

    constructor() {
        super();
        this.pressed = new Uint32Array(this.capacity);
        this.clicked = new Uint32Array(this.capacity);

        this.fields = [
            this.pressed,
            this.clicked,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:InputType): void {
        this.pressed[index] = data.pressed;
        this.clicked[index] = data.clicked;
    }

    read(index: number): InputType { // Só para debug
        return {
            pressed: this.pressed[index],
            clicked: this.clicked[index],
        }
    }

    protected onResize(): void {
        this.pressed = this.resizeArray(this.pressed);
        this.clicked = this.resizeArray(this.clicked);
    }

    protected setDefault(index: number): void {
        this.pressed[index] = 0;
        this.clicked[index] = 0;
    }
}