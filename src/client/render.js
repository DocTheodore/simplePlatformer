class Renderer {
    static _ctx = undefined;
    static _screenSize = { w:window.innerWidth, h:window.innerHeight };
    static _tileSize = 16;
    
    constructor(id, position = {x:0, y:0}, size={w:0, h:0}, color = '#fff') {
        this.id = id;
        this.position = position;
        this.size = size;
        this.color = color;
    }

    set x(vx) { this.position.x = vx }
    set y(vy) { this.position.y = vy }
    set w(vw) { this.size.w = vw }
    set h(vh) { this.size.h = vh }

    get x() { return this.position.x }
    get y() { return this.position.y }
    get w() { return this.size.w }
    get h() { return this.size.h }

    // Renderizar quadrados
    Rect() {
        Renderer._ctx.fillStyle = this.color;
        Renderer._ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.w,
            this.size.h
        );
    }

    // Renderizar tiles
    Tile() {
        Renderer._ctx.fillStyle = this.color;
        Renderer._ctx.fillRect(
            this.position.x * Renderer._tileSize,
            this.position.y * Renderer._tileSize,
            this.size.w * Renderer._tileSize,
            this.size.h * Renderer._tileSize
        );
    }

    // Recalcular o contexto da tela
    static set ctx(newContext) {Renderer._ctx = newContext}
    static set screenSize(newScreenSize) {Renderer._screenSize = newScreenSize}
    static set tileSize(newTileSize) {Renderer._tileSize= newTileSize}

    static get ctx() { return Renderer._ctx }
    static get screenSize() { return Renderer._screenSize }
    static get tileSize() { return Renderer._tileSize }

    // Clear
    static Clear() {
        Renderer._ctx.fillStyle = '#000';
        Renderer._ctx.fillRect(0, 0, Renderer._screenSize.w, Renderer._screenSize.h);
    }

}