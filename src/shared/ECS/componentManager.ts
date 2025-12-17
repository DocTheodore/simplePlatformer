//shared/ECS/componentManager.ts
import { ComponentStore } from "./components/_componentStore";

export class ComponentManager {
    private stores = new Map<number, ComponentStore<any>>();
    private entityMasks:number[] = [];

    registerComponent<T>(componentId: number, store: ComponentStore<T>) {
        this.stores.set(componentId, store);
    }

    addComponent(componentId: number, entity: number) {
        const store = this.stores.get(componentId);
        if (!store) throw 'Componente não registrado';

        store.add(entity);

        this.entityMasks[entity] = (this.entityMasks[entity] ?? 0) | componentId;
    }

    removeComponent(componentId: number, entity: number) {
        const store = this.stores.get(componentId);
        if (!store) return;

        if(store.has(entity)) {
            store.remove(entity);
            this.entityMasks[entity] &= ~componentId;
        }
    }

    hasComponent(componentId: number, entity: number): boolean {
        return (this.entityMasks[entity] & componentId) !== 0;
    }

    getStore<T extends ComponentStore<any>>(componentId: number): T {
        return this.stores.get(componentId) as T;
    }

    destroyEntity(entity: number) {
        for (const [componentId, store] of this.stores) {
            if(store.has(entity)) {
                store.remove(entity);
                this.entityMasks[entity] &= ~componentId;
            }
        }
        this.entityMasks[entity] = 0;
    }
}