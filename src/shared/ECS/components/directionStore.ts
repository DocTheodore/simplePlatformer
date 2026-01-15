//Shared/ECS/components/DirectionStore.ts
import { TypedArray } from "../../types.js";
import { DirectionType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class DirectionStore extends ComponentStore<DirectionType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    dirX: Int8Array;
    dirY: Int8Array;

    constructor() {
        super();
        this.dirX = new Int8Array(this.capacity);
        this.dirY = new Int8Array(this.capacity);

        this.fields = [
            this.dirX,
            this.dirY,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:DirectionType): void {
        this.dirX[index] = data.dirX;
        this.dirY[index] = data.dirY;
    }

    read(index: number): DirectionType { // Só para debug
        return {
            dirX: this.dirX[index],
            dirY: this.dirY[index],
        }
    }

    protected onResize(): void {
        this.dirX = this.resizeArray(this.dirX);
        this.dirY = this.resizeArray(this.dirY);
    }

    protected setDefault(index: number): void {
        this.dirX[index] = 0;
        this.dirY[index] = 0;
    }
}

