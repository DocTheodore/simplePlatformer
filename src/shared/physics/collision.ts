import { SOLID_TILES, TILE_SIZE } from "../constants.js";


export function checkTileCollision(
    x:number,
    y:number,
    w:number,
    h:number,
    getTile: (worldX: number, worldY: number) => number | null
) : boolean {
    const left   = Math.floor(x / TILE_SIZE);
    const right  = Math.floor((x + w - 1) / TILE_SIZE);
    const top    = Math.floor(y / TILE_SIZE);
    const bottom = Math.floor((y + h - 1) / TILE_SIZE);

    for(let ty = top; ty <= bottom; ty++) {
    for(let tx = left; tx <= right; tx++) {
        const tileId = getTile(tx, ty);

        if (tileId !== null && SOLID_TILES.has(tileId)) {
            return true;
        }
    }
    }

    return false
}