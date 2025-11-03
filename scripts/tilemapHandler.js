class TileMap {

    static data = [];

    constructor () {}

    static init () {
        TileMap.load('data/tilemap_a.txt');
    }

    static async load(filePath) {
        try{
            const response = await fetch(filePath)
            if(!response.ok) {
                throw new Error(`Erro de HTTP: ${response.status}`);
            }
            const textData = await response.text();
            return textData;
        } catch(err) {
            console.log("Erro ao carregar o mapa: ", err);
            return null;
        }
    }
}