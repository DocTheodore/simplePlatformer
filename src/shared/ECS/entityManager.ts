//shared/ECS/entityManager.ts
export class EntityManager {
    private nextId:number = 0;
    private recycledIds:number[] = [];

    create():number {
        if(this.recycledIds.length > 0) {
            return this.recycledIds.pop()!;
        }
        return this.nextId++;
    }

    destroy(entity: number) {
        this.recycledIds.push(entity);
    }
}