//shared/ECS/entityManager.ts
import { ComponentManager } from "./componentManager";

export class EntityManager {
    private nextId:number = 0;
    private recycledIds:number[] = [];
    private removedIds:number[] = [];
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
        if(this.componentManager.entityMasks[entity] !== 0) {
            this.removedIds.push(entity);
        }
        this.componentManager.destroyEntity(entity);
        this.componentManager.clearDirty(entity);
        this.recycledIds.push(entity);
    }

    // Alto custo de processamento
    getSnapShot(): any[] {
        const snap: any[] = [];
        const entities = this.componentManager.getAllEntities();

        for(const entity of entities) {
            const obj: any = {id: entity};
            const mask = this.componentManager.entityMasks[entity];

            for(const [compId, store] of this.componentManager.stores ) {
                if((mask & compId) !== 0) {
                    obj[compId] = store.serialize(entity);
                }
            }
            snap.push(obj);
        }
        return snap;
    }

    getDelta(): any[] {
        const delta: any[] = [];

        // Entidades removidas
        for(const id of this.removedIds) {
            delta.push({id, removed: true});
        }
        this.removedIds.length = 0;

        // Mudanças registradas
        const dirtyEntities = this.componentManager.getDirtyEntities();
        for (const entity of dirtyEntities) {
            const obj: any = {id: entity};
            const dirty = this.componentManager.dirtyMasks[entity];
            const mask = this.componentManager.entityMasks[entity];
            let changed = false;

            for(const [compId, store] of this.componentManager.stores) {
                if ((dirty & compId) !== 0) {
                    if((mask & compId) !== 0) {
                        obj[compId] = store.serialize(entity);
                    } else {
                        obj[compId] = null;
                    }
                    changed = true;
                }
            }
            if (changed) {
                delta.push(obj);
            }
            this.componentManager.clearDirty(entity);
        }

        return delta;
    }

    // Debbug
    _Show() {
        return [this.nextId, this.recycledIds];
    }
}