import { Camera } from "./camera.js";

export class EntityRender {
    static ctx: CanvasRenderingContext2D;

    static init(ctx:CanvasRenderingContext2D) {
        EntityRender.ctx = ctx;
    }

    static render(x:number, y:number, w:number, h:number, color:string) {
        if (!EntityRender.ctx) return;

        const screen = Camera.worldToScreen(x, y);

        this.ctx.fillStyle = color || "#f0f";
        this.ctx.fillRect(
            Math.floor(screen.x),
            Math.floor(screen.y),
            w,
            h,
        )
    }
}