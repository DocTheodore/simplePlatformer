//shared/ECS/componentManager.ts
import { ComponentStore } from "./components/componentStore";

export class ComponentManager {
    private stores = new Map<number, ComponentStore>();
    private entityMasks:number[] = [];

    registerComponent(componentId: number, store: ComponentStore) {
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

    getStore<T extends ComponentStore>(componentId: number): T {
        return this.stores.get(componentId) as T;
    }

    destroyEntity(entity: number) {
        for (const [componentId, store] of this.stores) {
            if(store.has(entity)) {
                store.remove(entity);
                this.entityMasks[entity] &= ~componentId;
            }
        }
    }
}