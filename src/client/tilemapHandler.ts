export class TileMap {

    static fileData:any[] = [];
    static loaded = false;

    constructor () {}

    static async init () {
        return TileMap.load('./data/tilemap_a.txt');
    }

    static async load(filePath:string) {
        try{
            const response = await fetch(filePath)
            if(!response.ok) {
                throw new Error(`Erro de HTTP: ${response.status}`);
            }
            const fileData = await response.text();
            TileMap.fileData = TileMap.parseTileMap(fileData);
            TileMap.loaded = true;
            return response;
        } catch(err) {
            console.log("Erro ao carregar o mapa: ", err);
            return null;
        }
    }

    static parseTileMap (text:string) {
        const lines = text.trim().split('\n');
        const tilemap = [];

        for(const line of lines) {
            const row = line.split(',').map(Number);
            tilemap.push(row);
        }

        return tilemap;
    }
}