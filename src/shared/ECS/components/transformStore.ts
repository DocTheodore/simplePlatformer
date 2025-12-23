//Shared/ECS/components/transformStore.ts
import { TypedArray } from "../../types.js";
import { TransformType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";
export class TransformStore extends ComponentStore<TransformType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    posX: Float32Array;
    posY: Float32Array;
    sizeX: Float32Array;
    sizeY: Float32Array;
    rotation: Float32Array;

    constructor() {
        super();
        this.posX = new Float32Array(this.capacity);
        this.posY = new Float32Array(this.capacity);
        this.sizeX = new Float32Array(this.capacity);
        this.sizeY = new Float32Array(this.capacity);
        this.rotation = new Float32Array(this.capacity);

        this.fields = [
            this.posX,
            this.posY, 
            this.sizeX, 
            this.sizeY, 
            this.rotation
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:TransformType): void {
        this.posX[index] = data.posX;
        this.posY[index] = data.posY;
        this.sizeX[index] = data.sizeX;
        this.sizeY[index] = data.sizeY;
        this.rotation[index] = data.rotation;
    }

    read(index: number): TransformType { // Só para debug
        return {
            posX: this.posX[index],
            posY: this.posY[index],
            sizeX: this.sizeX[index],
            sizeY: this.sizeY[index],
            rotation: this.rotation[index],
        }
    }

    protected onResize(): void {
        this.posX = this.resizeArray(this.posX);
        this.posY = this.resizeArray(this.posY);
        this.sizeX = this.resizeArray(this.sizeX);
        this.sizeY = this.resizeArray(this.sizeY);
        this.rotation = this.resizeArray(this.rotation);
    }

    protected setDefault(index: number): void {
        this.posX[index] = 0;
        this.posY[index] = 0;
        this.sizeX[index] = 0;
        this.sizeY[index] = 0;
        this.rotation[index] = 0;
    }
}