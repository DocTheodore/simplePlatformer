import { ComponentStore } from "./componentStore.js";

export class PositionStore extends ComponentStore {
    x:number[] = [];
    y:number[] = [];

    static defaultPosition = {x: 0, y: 0}

    constructor() {super()}

    add(entity:number): number {
        const index = super.add(entity);

        this.x[index] = PositionStore.defaultPosition.x;
        this.y[index] = PositionStore.defaultPosition.y;

        return index;
    }

    remove(entity:number): void {
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        this.copy(index, lastIndex);
        super.remove(entity);
    }

    // --------------------------- Abstract -------------------------

    set(entity:number, data:{x: number, y:number}): void {
        const index = this.indexOf(entity);
        this.x[index] = data.x;
        this.y[index] = data.y;
    }

    read(index: number): {x: number, y:number} {
        return {
            x: this.x[index],
            y: this.y[index],
        }
    }

    serialize(entity: number): {x: number, y:number} {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    copy(indexA: number, indexB: number): void {
        const tempX = this.x[indexA];
        const tempY = this.y[indexA];

        this.x[indexA] = this.x[indexB];
        this.y[indexA] = this.y[indexB];

        this.x[indexB] = tempX;
        this.y[indexB] = tempY;
    }
}