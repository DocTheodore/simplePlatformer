// shared/types/components

export interface TransformType { // [0]
    posX: number;
    posY: number;
    sizeX: number;
    sizeY: number;
    rotation: number;
}
export interface VelocityType { // [1]
    velX: number;
    velY: number;
}
export interface SpriteType { // [2]
    spriteId: number;
    layer: number;
    flipped: number;
    visible: number;
}

export const enum ComponentId { // Max = 32
    Transform = 1 << 0,
    Velocity  = 1 << 1,
    Sprite    = 1 << 2,
}