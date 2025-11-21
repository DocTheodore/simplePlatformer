export class Camera {
    static x = 0;
    static y = 0;

    static screenWidth = window.innerWidth;
    static screenHeight = window.innerHeight;

    static resize(w:number, h:number) {
        this.screenWidth = w;
        this.screenHeight = h;
    }

    static worldToScreen(worldX:number, worldY:number): {x:number, y:number} {
        return {
            x: worldX - this.x + this.screenWidth / 2,
            y: worldY - this.y + this.screenHeight / 2,
        }
    }

    static screenToWorld(screenX:number, screenY:number): {x:number, y:number} {
        return {
            x: this.x - this.screenWidth / 2 + screenX,
            y: this.y - this.screenHeight / 2 + screenY,
        }
    }

    static follow(target:{x:number, y:number}, lerp:number = 0.1) {
        this.x += (target.x - this.x) * lerp;
        this.y += (target.y - this.y) * lerp;
    }
}