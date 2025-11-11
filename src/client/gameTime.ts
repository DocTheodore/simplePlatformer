export class GameTime {
    static _delta = 0;
    static _last = performance.now();

    constructor() {}

    static Update() {
        const now = performance.now();
        this._delta = Math.min((now - this._last) / 1000, 0.1);
        this._last = now;
    }

    static get delta() {
        return this._delta;
    }

    static get now() {
        return performance.now();
    }
}