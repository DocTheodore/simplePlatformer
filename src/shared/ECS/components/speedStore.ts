//Shared/ECS/components/SpeedStore.ts
import { TypedArray } from "../../types.js";
import { SpeedType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class SpeedStore extends ComponentStore<SpeedType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    acceleration: Float32Array;
    topSpeed: Float32Array;
    friction: Float32Array;

    constructor() {
        super();
        this.acceleration = new Float32Array(this.capacity);
        this.topSpeed = new Float32Array(this.capacity);
        this.friction = new Float32Array(this.capacity);

        this.fields = [
            this.acceleration,
            this.topSpeed,
            this.friction,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:SpeedType): void {
        this.acceleration[index] = data.acceleration;
        this.topSpeed[index] = data.topSpeed;
        this.friction[index] = data.friction;
    }

    read(index: number): SpeedType { // Só para debug
        return {
            acceleration: this.acceleration[index],
            topSpeed: this.topSpeed[index],
            friction: this.friction[index],
        }
    }

    protected onResize(): void {
        this.acceleration = this.resizeArray(this.acceleration);
        this.topSpeed = this.resizeArray(this.topSpeed);
        this.friction = this.resizeArray(this.friction);
    }

    protected setDefault(index: number): void {
        this.acceleration[index] = 0;
        this.topSpeed[index] = 0;
        this.friction[index] = 0;
    }
}