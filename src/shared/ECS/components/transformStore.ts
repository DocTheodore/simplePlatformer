import { ComponentStore } from "./componentStore.js";

type transformType = {
    posX: number,
    posY: number,
    sizeX: number,
    sizeY: number,
    rotation: number,
}

export class TransformStore extends ComponentStore {
    posX: number[] = [];
    posY: number[] = [];
    sizeX: number[] = [];
    sizeY: number[] = [];
    rotation: number[] = []

    static defaultTransform = {
        posX: 0,
        posY: 0,
        sizeX: 0,
        sizeY: 0,
        rotation: 0,
    }

    constructor() {super()}

    add(entity:number): number {
        const index = super.add(entity);

        this.posX[index] = TransformStore.defaultTransform.posX;
        this.posY[index] = TransformStore.defaultTransform.posY;
        this.sizeX[index] = TransformStore.defaultTransform.sizeX;
        this.sizeY[index] = TransformStore.defaultTransform.sizeY;
        this.rotation[index] = TransformStore.defaultTransform.rotation;

        return index;
    }

    remove(entity:number): void {
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        this.copy(index, lastIndex);
        super.remove(entity);
    }

    // --------------------------- Abstract -------------------------

    set(entity:number, data:transformType): void {
        const index = this.indexOf(entity);
        this.posX[index] = data.posX;
        this.posY[index] = data.posY;
        this.sizeX[index] = data.sizeX;
        this.sizeY[index] = data.sizeY;
        this.rotation[index] = data.rotation;
    }

    read(index: number): {
        posX: number,
        posY: number,
        sizeX: number,
        sizeY: number,
        rotation: number,
    } {
        return {
            posX: this.posX[index],
            posY: this.posY[index],
            sizeX: this.sizeX[index],
            sizeY: this.sizeY[index],
            rotation: this.rotation[index],
        }
    }

    serialize(entity: number): {
        posX: number,
        posY: number,
        sizeX: number,
        sizeY: number,
        rotation: number,
    } {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    copy(indexA: number, indexB: number): void {
        const tempPosX = this.posX[indexA];
        const tempPosY = this.posY[indexA];
        const tempSizeX = this.sizeX[indexA];
        const tempSizeY = this.sizeY[indexA];
        const tempRotation = this.rotation[indexA];

        this.posX[indexA] = this.posX[indexB];
        this.posY[indexA] = this.posY[indexB];
        this.sizeX[indexA] = this.sizeX[indexB];
        this.sizeY[indexA] = this.sizeY[indexB];
        this.rotation[indexA] = this.rotation[indexB];

        this.posX[indexB] = tempPosX;
        this.posY[indexB] = tempPosY;
        this.sizeX[indexB] = tempSizeX;
        this.sizeY[indexB] = tempSizeY;
        this.rotation[indexB] = tempRotation;
    }
}