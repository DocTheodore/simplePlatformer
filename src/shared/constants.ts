export const CHUNK_SIZE = 64;
export const TILE_SIZE = 16;

export enum INPUT {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    JUMP,
    MOUSE_A,
    MOUSE_B,
}

export const PLAYER = {
    HEIGHT: 60,
    WIDTH: 30,
}

export const SOLID_TILES = new Set<number>([1, 2, 3]);