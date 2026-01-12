//Shared/ECS/components/velocityStore.ts
import { TypedArray } from "../../types.js";
import { VelocityType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class VelocityStore extends ComponentStore<VelocityType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    velX: Float32Array;
    velY: Float32Array;

    constructor() {
        super();
        this.velX = new Float32Array(this.capacity);
        this.velY = new Float32Array(this.capacity);

        this.fields = [
            this.velX,
            this.velY,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:VelocityType): void {
        this.velX[index] = data.velX;
        this.velY[index] = data.velY;
    }

    read(index: number): VelocityType { // Só para debug
        return {
            velX: this.velX[index],
            velY: this.velY[index],
        }
    }

    protected onResize(): void {
        this.velX = this.resizeArray(this.velX);
        this.velY = this.resizeArray(this.velY);
    }

    protected setDefault(index: number): void {
        this.velX[index] = 0;
        this.velY[index] = 0;
    }
}