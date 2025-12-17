import { SpriteType, VelocityType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class VelocityStore extends ComponentStore<VelocityType> {
    velX: number[] = [];
    velY: number[] = [];

    static defaultVelocity = {
        velX: 0,
        velY: 0,
    }

    constructor() {super()}

    add(entity:number): number {
        const index = super.add(entity);

        this.velX[index] = VelocityStore.defaultVelocity.velX;
        this.velY[index] = VelocityStore.defaultVelocity.velY;

        return index;
    }

    remove(entity:number): void {
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        this.copy(index, lastIndex);
        super.remove(entity);
    }

    // --------------------------- Abstract -------------------------

    set(entity:number, data:VelocityType): void {
        const index = this.indexOf(entity);
        this.velX[index] = data.velX;
        this.velY[index] = data.velY;
    }

    read(index: number): VelocityType {
        return {
            velX: this.velX[index],
            velY: this.velY[index],
        }
    }

    serialize(entity: number): VelocityType {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    copy(indexA: number, indexB: number): void {
        const tempVelX = this.velX[indexA];
        const tempVelY = this.velY[indexA];

        this.velX[indexA] = this.velX[indexB];
        this.velY[indexA] = this.velY[indexB];

        this.velX[indexB] = tempVelX;
        this.velY[indexB] = tempVelY;
    }
}
