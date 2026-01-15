//Shared/ECS/components/ChunkStore.ts
import { TypedArray } from "../../types.js";
import { ChunkType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class ChunkStore extends ComponentStore<ChunkType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    chunkX: Int16Array;
    chunkY: Int16Array;

    constructor() {
        super();
        this.chunkX = new Int16Array(this.capacity);
        this.chunkY = new Int16Array(this.capacity);

        this.fields = [
            this.chunkX,
            this.chunkY,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:ChunkType): void {
        this.chunkX[index] = data.chunkX;
        this.chunkY[index] = data.chunkY;
    }

    read(index: number): ChunkType { // Só para debug
        return {
            chunkX: this.chunkX[index],
            chunkY: this.chunkY[index],
        }
    }

    protected onResize(): void {
        this.chunkX = this.resizeArray(this.chunkX);
        this.chunkY = this.resizeArray(this.chunkY);
    }

    protected setDefault(index: number): void {
        this.chunkX[index] = 0;
        this.chunkY[index] = 0;
    }
}