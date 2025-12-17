import { SpriteType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class SpriteStore extends ComponentStore<SpriteType> {
    spriteId: number[] = [];
    colorId: number[] = [];
    layer: number[] = [];
    facingLeft: boolean[] = [];
    visible: boolean[] = [];

    static defaultSprite = {
        spriteId: 0,
        colorId: 0,
        layer: 0,
        facingLeft: false,
        visible: false,
    }

    constructor() {super()}

    add(entity:number): number {
        const index = super.add(entity);

        this.spriteId[index] = SpriteStore.defaultSprite.spriteId;
        this.colorId[index] = SpriteStore.defaultSprite.colorId;
        this.layer[index] = SpriteStore.defaultSprite.layer;
        this.facingLeft[index] = SpriteStore.defaultSprite.facingLeft;
        this.visible[index] = SpriteStore.defaultSprite.visible;

        return index;
    }

    remove(entity:number): void {
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        this.copy(index, lastIndex);
        super.remove(entity);
    }

    // --------------------------- Abstract -------------------------

    set(entity:number, data:SpriteType): void {
        const index = this.indexOf(entity);
        this.spriteId[index] = data.spriteId;
        this.colorId[index] = data.colorId;
        this.layer[index] = data.layer;
        this.facingLeft[index] = data.facingLeft;
        this.visible[index] = data.visible;
    }

    read(index: number): SpriteType {
        return {
            spriteId: this.spriteId[index],
            colorId: this.colorId[index],
            layer: this.layer[index],
            facingLeft: this.facingLeft[index],
            visible: this.visible[index],
        }
    }

    serialize(entity: number): SpriteType {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    copy(indexA: number, indexB: number): void {
        const tempSpriteId = this.spriteId[indexA];
        const tempColorId = this.colorId[indexA];
        const tempLayer = this.layer[indexA];
        const tempFacingLeft = this.facingLeft[indexA];
        const tempVisible = this.visible[indexA];

        this.spriteId[indexA] = this.spriteId[indexB];
        this.colorId[indexA] = this.colorId[indexB];
        this.layer[indexA] = this.layer[indexB];
        this.facingLeft[indexA] = this.facingLeft[indexB];
        this.visible[indexA] = this.visible[indexB];

        this.spriteId[indexB] = tempSpriteId;
        this.colorId[indexB] = tempColorId;
        this.layer[indexB] = tempLayer;
        this.facingLeft[indexB] = tempFacingLeft;
        this.visible[indexB] = tempVisible;
    }
}