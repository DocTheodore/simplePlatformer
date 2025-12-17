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
    colorId: number;
    layer: number;
    facingLeft: boolean;
    visible: boolean;
}

export const COMP = { // Max = 32
    TRANSFORM: 1 << 0,
    VELOCITY: 1 << 1,
    SPRITE: 1 << 2,
} as const;