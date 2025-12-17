//shared/ECS/components/componentStore
export abstract class ComponentStore<T> {
    protected dense:number[] = [];
    protected sparse:number[] = [];

    /*
     * Dense -> sempre usa index, retorna um entity valido
     * Sparse -> sempre usa entity, retorna um index valido
     * [Data] -> sempre usa index, definido pelo componente
     */

    constructor() {}

    add(entity: number): number {
        const index = this.dense.length;
        this.dense.push(entity);

        this.sparse[entity] = index;
        return index;
    }

    remove(entity:number): void {                                                                       
        const index = this.sparse[entity];
        const lastIndex = this.dense.length-1;

        this.dense[index] = this.dense[lastIndex];

        const movedEntity = this.dense[index];
        this.sparse[movedEntity] = index;

        this.dense.pop();
        this.sparse[entity] = undefined!;
    }

    has(entity:number): boolean {
        return this.sparse[entity] !== undefined;
    }

    get(entity:number): any {
        const index = this.sparse[entity]
        return this.read(index);
    }

    indexOf(entity:number): number {
        return this.sparse[entity];
    }

    swapIndex(entityA:number, entityB:number): void {
        const indexA = this.sparse[entityA];
        const indexB = this.sparse[entityB];

        this.dense[indexA] = entityB;
        this.dense[indexB] = entityA;

        this.sparse[entityA] = indexB;
        this.sparse[entityB] = indexA;

        this.copy(indexA, indexB);
    }

    abstract set(entity:number, data: T): void;
    abstract read(index: number): T;
    abstract serialize(entity: number): T;
    abstract copy(indexA:number, indexB:number): void;
}

/*/ --- Padrão das Stores 

import { CompType } from "../../types/components.js";
import { ComponentStore } from "./_componentStore.js";

export class CompStore extends ComponentStore {
    variable: any[] = [];

    static defaultComp = {
        variable: null,
    }

    constructor() {super()}

    add(entity:number): number {
        const index = super.add(entity);

        this.variable[index] = CompStore.defaultComp.variable;

        return index;
    }

    remove(entity:number): void {
        const index = this.indexOf(entity);
        const lastIndex = this.dense.length - 1;

        this.copy(index, lastIndex);
        super.remove(entity);
    }

    // --------------------------- Abstract -------------------------

    set(entity:number, data:CompType): void {
        const index = this.indexOf(entity);
        this.variable[index] = data.variable;
    }

    read(index: number): CompType {
        return {
            variable: this.variable[index],
        }
    }

    serialize(entity: number): CompType {
        const index = this.indexOf(entity);
        return this.read(index);
    }

    copy(indexA: number, indexB: number): void {
        const tempVariable = this.variable[indexA];

        this.variable[indexA] = this.variable[indexB];

        this.variable[indexB] = tempVariable;
    }
}

/*/