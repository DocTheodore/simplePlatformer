export class GameEntity {
    private id:number;
    private components:any[];
    
    constructor(id:number, components=[]) {
        this.id = id;
        this.components = components;
    }
}