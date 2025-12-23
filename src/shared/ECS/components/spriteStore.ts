//Shared/ECS/components/spriteStore.ts
import { TypedArray } from "../../types.js";
import { SpriteType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class spriteStore extends ComponentStore<SpriteType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    spriteId: Uint16Array;
    layer: Uint8Array;
    flipped: Uint8Array; // 0 | 1
    visible: Uint8Array; // 0 | 1

    constructor() {
        super();
        this.spriteId = new Uint16Array(this.capacity);
        this.layer = new Uint8Array(this.capacity);
        this.flipped = new Uint8Array(this.capacity);
        this.visible = new Uint8Array(this.capacity);

        this.fields = [
            this.spriteId,
            this.layer,
            this.flipped,
            this.visible,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:SpriteType): void {
        this.spriteId[index] = data.spriteId;
    }

    read(index: number): SpriteType { // Só para debug
        return {
            spriteId: this.spriteId[index],
            layer: this.layer[index],
            flipped: this.flipped[index],
            visible: this.visible[index],
        }
    }

    protected onResize(): void {
        this.spriteId = this.resizeArray(this.spriteId);
        this.layer = this.resizeArray(this.layer);
        this.flipped = this.resizeArray(this.flipped);
        this.visible = this.resizeArray(this.visible);
    }

    protected setDefault(index: number): void {
        this.spriteId[index] = 0;
        this.layer[index] = 0;
        this.flipped[index] = 0;
        this.visible[index] = 0;
    }
}