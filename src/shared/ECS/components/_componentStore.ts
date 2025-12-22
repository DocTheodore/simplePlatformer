//shared/ECS/components/componentStore.ts
import { TypedArray, TypedArrayConstructor } from "../../types";

export abstract class ComponentStore<T> {

    protected abstract capacity: number;
    protected abstract fields: TypedArray[];
    protected sparse: Array<number | undefined> = [];
    dense:number[] = [];
    changed: Array<number | undefined> = [];

    /*
     * Capacity -> tamanho do length dos Arrays em "fields"
     * fields   -> lista de referencia às propriedades do componente
     * Sparse   -> sempre usa entity, retorna um index valido
     * Dense    -> sempre usa index, retorna um entity valido
     * Changed  -> sempre usa index, retorna um entity que foi mudado (delta)
     */

    constructor() {}

    add(entity: number): number {
        const index = this.dense.length;
        this.dense.push(entity);
        this.sparse[entity] = index;

        this.ensureCapacity(index + 1);
        this.setDefault(index);

        return index;
    }

    remove(entity:number): void {                                                                       
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        if(index !== lastIndex) {
            this.copy(index, lastIndex);
            
            const movedEntity = this.dense[lastIndex];
            this.dense[index] = movedEntity;
            this.sparse[movedEntity] = index;
        }

        this.dense.pop();
        this.sparse[entity] = undefined;
    }

    has(entity:number): boolean {
        return this.sparse[entity] !== undefined;
    }

    get(entity:number): T {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    indexOf(entity:number): number {
        const index = this.sparse[entity];

        if(index === undefined) {
            throw new Error(`Entity ${entity} not found in store`);
        }

        return index;
    }

    swapIndex(entityA:number, entityB:number): void {
        const indexA = this.indexOf(entityA);
        const indexB = this.indexOf(entityB);

        this.dense[indexA] = entityB;
        this.dense[indexB] = entityA;

        this.sparse[entityA] = indexB;
        this.sparse[entityB] = indexA;

        this.copy(indexA, indexB);
    }

    copy(indexA: number, indexB: number): void {
        for (let i=0; i < this.fields.length; i++) {
            const field = this.fields[i];

            const temp = field[indexA];
            field[indexA] = field[indexB];

            field[indexB] = temp;
        }
    }

    serialize(entity: number): T { // Evitar usar fora de snapshot
        const index = this.indexOf(entity);
        return this.read(index);
    }

    clearChanges() {
        for(let index=0; index < this.dense.length; index++) {
            this.changed[index] = undefined;
        }
    }

    protected resizeArray<T extends TypedArray>(originalArray: T): T {
        const Constructor = originalArray.constructor as TypedArrayConstructor<T>;

        const newInstance = new Constructor(this.capacity);
        newInstance.set(originalArray as any);

        return newInstance;
    }

    protected ensureCapacity(minCapacity: number): void {
        if(minCapacity > this.capacity) {
            this.capacity = Math.max(this.capacity * 2, minCapacity);
            this.onResize();
        }
    }

    abstract set(index: number, data: T): void;
    abstract read(index: number): T;
    protected abstract onResize(): void;
    protected abstract setDefault(index: number): void;
}

/*/ --- Padrão das Stores

// #component#
// #props#
// #TypedArray#

//Shared/ECS/components/#component#Store.ts
import { TypedArray } from "../../types.js";
import { #component#Type } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class #component#Store extends ComponentStore<#component#Type> {
    protected capacity: number = 256;
    protected fields: TypedArray[] = [];

    // Proprieades
    #props#: #TypedArray#;

    constructor() {
        super();
        this.#props# = new #TypedArray#(this.capacity);

        this.fields = [
            this.#props#,
        ]

        Object.seal(this);
    }

    // --------------------------- Abstract -------------------------

    set(index:number, data:#component#Type): void {
        this.#props#[index] = data.#props#;
    }

    read(index: number): #component#Type { // Só para debug
        return {
            #props#: this.#props#[index],
        }
    }

    protected onResize(): void {
        this.#props# = this.resizeArray(this.#props#);

        this.fields = [
            this.#props#,
        ];
    }

    protected setDefault(index: number): void {
        this.#props#[index] = 0;
    }
}

/*/