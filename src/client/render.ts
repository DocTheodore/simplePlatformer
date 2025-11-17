interface Vec2 {
    x: number;
    y: number;
}

interface Size {
    w: number;
    h: number;
}

export class Renderer {
    private static _ctx: CanvasRenderingContext2D | null = null;
    private static _screenSize: Size = { w: window.innerWidth, h: window.innerHeight };
    private static _tileSize = 16;
    private static _offset = {x:0, y:0};

    private id: number;
    private position: Vec2;
    private size: Size;
    private color: string;

    constructor(
        id: number,
        position: Vec2 = { x: 0, y: 0 },
        size: Size = { w: 0, h: 0 },
        color = '#fff'
    ) {
        this.id = id;
        this.position = { ...position }; // clone
        this.size = { ...size };         // clone
        this.color = color;
    }

    set x(vx: number) { this.position.x = vx; }
    set y(vy: number) { this.position.y = vy; }
    set w(vw: number) { this.size.w = vw; }
    set h(vh: number) { this.size.h = vh; }

    get x(): number { return this.position.x; }
    get y(): number { return this.position.y; }
    get w(): number { return this.size.w; }
    get h(): number { return this.size.h; }

    // === Métodos de renderização ===
    Rect() {
        if (!Renderer._ctx) return;
        Renderer._ctx.fillStyle = this.color;
        Renderer._ctx.fillRect(
            this.position.x - Renderer.offSetX,
            this.position.y - Renderer.offSetY,
            this.size.w,
            this.size.h
        );
    }

    Tile() {
        if (!Renderer._ctx) return;
        Renderer._ctx.fillStyle = this.color;
        Renderer._ctx.fillRect(
            this.position.x * Renderer._tileSize - Renderer.offSetX,
            this.position.y * Renderer._tileSize - Renderer.offSetY,
            this.size.w * Renderer._tileSize,
            this.size.h * Renderer._tileSize
        );
    }

    // === Getters e Setters estáticos ===
    static set ctx(newContext: CanvasRenderingContext2D | null) {
        Renderer._ctx = newContext;
    }
    static set screenSize(newScreenSize: Size) {
        Renderer._screenSize = { ...newScreenSize };
    }
    static set tileSize(newTileSize: number) {
        Renderer._tileSize = newTileSize;
    }
    static set offSetX(x:number) {
        Renderer._offset.x = x;
    }
    static set offSetY(y:number) {
        Renderer._offset.y = y;
    }

    static get ctx(): CanvasRenderingContext2D | null {
        return Renderer._ctx;
    }
    static get screenSize(): Size {
        return { ...Renderer._screenSize }; // retorna cópia
    }
    static get tileSize(): number {
        return Renderer._tileSize;
    }
    static get offSetX() {
        return Renderer._offset.x;
    }
    static get offSetY() {
        return Renderer._offset.y;
    }


    // === Clear ===
    static Clear() {
        if (!Renderer._ctx) return;
        Renderer._ctx.fillStyle = '#000';
        Renderer._ctx.fillRect(0, 0, Renderer._screenSize.w, Renderer._screenSize.h);
    }
}