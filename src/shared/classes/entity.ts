//src/shared/classes/entity.ts
import { Components, EntityId } from "../types/components.js";

export type ComponentsMap = Record<string, any>;

export class EntityManager {
    private entities = new Map<EntityId, ComponentsMap>();

    create(id:EntityId) {
        this.entities.set(id, {});
        return id;
    }

    destroy(id:EntityId) {
        this.entities.delete(id);
        return id;
    }

    find(id:EntityId) {
        return this.entities.has(id);
    }

    add<T>(id:EntityId, type:string, component: T) {
        const ent = this.entities.get(id);
        if (ent) ent[type] = component;
    }

    remove(id:EntityId, type:string) {
        const ent = this.entities.get(id);
        if (ent) delete ent[type];
    }

    clear(): void {
        this.entities.clear();
    }

    get<T>(id:EntityId, type:string): T | undefined {
        return this.entities.get(id)?.[type];
    }

    has(id:EntityId, ...types:string[]): boolean {
        const ent = this.entities.get(id);
        if (!ent) return false;
        return types.every(t => t in ent);
    }

    query(...types:string[]): [EntityId, ComponentsMap][] {
        const result: [EntityId, ComponentsMap][] = [];

        for(const [id, comps] of this.entities.entries()) {
            if(types.every(t => t in comps)) {
                result.push([id, comps]);
            }
        }

        return result;
    }

    getDelta(previous: Map<EntityId, ComponentsMap>): any[] {
        const delta:any[] = []

        for(const [id, current] of this.entities ) {
            const prev = previous.get(id) || {};
            const changes:any = {};

            for (const key in current) {
                //console.log('current:', current[key], 'prev:', prev[key])
                if(JSON.stringify(current[key]) !== JSON.stringify(prev[key])) {
                    changes[key] = current[key];
                }
            }

            if(Object.keys(changes).length > 0 || !previous.has(id)) {
                delta.push({id, ...changes});
            }
        }

        for(const id of previous.keys()){
            if(!this.entities.has(id)) {
                delta.push({ id, $removed: true});
            }
        }

        /* if (delta.length > 0) {
            console.log('=== delta ===');
            console.log(delta);
        } */

        return delta;
    }

    snapshot() {
        const snapshot = new Map<EntityId, ComponentsMap>();
        for (const [id, components] of this.entities) {
            snapshot.set(id, structuredClone(components));
        }
        return snapshot;
    }
}