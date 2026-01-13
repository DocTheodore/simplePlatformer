//Shared/ECS/components/NetworkStore.ts
import { TypedArray } from "../../types.js";
import { NetworkType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class NetworkStore extends ComponentStore<NetworkType> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    netId: Uint16Array;
    scope: Uint8Array; // NetScope
    rate: Uint8Array;

    constructor() {
        super();
        this.netId = new Uint16Array(this.capacity);
        this.scope = new Uint8Array(this.capacity);
        this.rate = new Uint8Array(this.capacity);

        this.fields = [
            this.netId,
            this.scope,
            this.rate,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:NetworkType): void {
        this.netId[index] = data.netId;
        this.scope[index] = data.scope;
        this.rate[index] = data.rate;
    }

    read(index: number): NetworkType { // Só para debug
        return {
            netId: this.netId[index],
            scope: this.scope[index],
            rate: this.rate[index],
        }
    }

    protected onResize(): void {
        this.netId = this.resizeArray(this.netId);
        this.scope = this.resizeArray(this.scope);
        this.rate = this.resizeArray(this.rate);
    }

    protected setDefault(index: number): void {
        this.netId[index] = 0;
        this.scope[index] = 0;
        this.rate[index] = 0;
    }
}
