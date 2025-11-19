import { TILE_SIZE } from "../../shared/constants.js";
import { TileMap } from "../world/tilemapHandler.js";
import { Camera } from "./camera.js";

const COLORS: Record<number, string> = {
    0: "transparent",
    1: "#0f3",
    2: "#a63",
    3: "#888",
    4: "#083",
}

export class WorldRender {
    static ctx: CanvasRenderingContext2D;

    static init(ctx:CanvasRenderingContext2D) {
        WorldRender.ctx = ctx;
    }

    static render() {
        if (!WorldRender.ctx) return;

        const startTileX = Math.floor((Camera.x - Camera.screenWidth / 2) / TILE_SIZE) - 2;
        const startTileY = Math.floor((Camera.y - Camera.screenHeight / 2) / TILE_SIZE) - 2;
        const endTileX = Math.ceil((Camera.x + Camera.screenWidth / 2) / TILE_SIZE) + 2;
        const endTileY = Math.ceil((Camera.y + Camera.screenHeight / 2) / TILE_SIZE) + 2;

        for (let ty=startTileY; ty < endTileY; ty++) {
        for (let tx=startTileX; tx < endTileX; tx++) {
            const tileId = TileMap.getTile(tx, ty);
            if (tileId === 0) continue;

            const worldX = tx * TILE_SIZE;
            const worldY = ty * TILE_SIZE;
            const screen = Camera.worldToScreen(worldX, worldY);

            this.ctx.fillStyle = COLORS[tileId] || "#f0f";
            this.ctx.fillRect(
                Math.round(screen.x),
                Math.round(screen.y),
                TILE_SIZE,
                TILE_SIZE,
            )
        }
        }
    }
}