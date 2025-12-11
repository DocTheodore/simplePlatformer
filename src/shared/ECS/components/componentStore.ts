export abstract class ComponentStore {
    dense:number[] = [];
    sparse:number[] = [];

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
        (this.sparse[entity] as number | undefined) = undefined;
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

    abstract set(entity:number, data: Object): void;
    abstract read(index: number): any;
    abstract serialize(entity: number): Object;
    abstract copy(indexA:number, indexB:number): void;
}