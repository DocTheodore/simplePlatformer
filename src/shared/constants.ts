
export const CHUNK_SIZE = 64;
export const TILE_SIZE = 16;

export enum INPUT {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    JUMP,
}
export enum MOUSE_ID {
    MOUSE_A,
    MOUSE_B,
}

export const PLAYER = {
    HEIGHT: 60,
    WIDTH: 30,
}

export const SOLID_TILES = new Set<number>([1, 2, 3]);

export enum COMPONENTS {
    POSITION,
    VELOCITY,
    FACING,
    ONGROUND,
    HEALTH,
    COLOR,
    INPUTKEY,
    INPUTMOUSE,
    PLAYERTAG,
    CHUNKPOS,
}