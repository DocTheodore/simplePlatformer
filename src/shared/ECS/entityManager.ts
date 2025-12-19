//shared/ECS/entityManager.ts
import { ComponentManager } from "./componentManager";

export class EntityManager {
    private nextId:number = 0;
    private recycledIds:number[] = [];
    private componentManager: ComponentManager;

    constructor(comp: ComponentManager) {
        this.componentManager = comp;
    }

    create():number {
        if(this.recycledIds.length > 0) {
            return this.recycledIds.pop()!;
        }
        return this.nextId++;
    }

    destroy(entity: number) {
        this.recycledIds.push(entity);
        this.componentManager.destroyEntity(entity);
    }
}