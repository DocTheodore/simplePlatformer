// shared/types/components

/**
 * Pipeline de sistemas:
 * 
 * 1 - Decisão (Input/IA)
 * 2 - Controle (Interpretação)
 * 3 - Regras
 * 4 - Física
 * 5 - Resultado
 * 
 */

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

export interface ChunkType { // [3]
    chunkX: number;
    chunkY: number;
}

export interface NetworkType { // [4]
    netId: number;
    scope: NetScope;
    rate: number;
}

export interface InputType { // [5]
    pressed: InputMap;
    clicked: InputMap;
}

export interface DirectionType { // [6]
    dirX: number;
    dirY: number;
}

export enum ComponentId { // Max = 32
    Transform = 1 << 0,
    Velocity  = 1 << 1,
    Sprite    = 1 << 2,
    Chunk     = 1 << 3,
    Network   = 1 << 4,
    Input     = 1 << 5,
    Direction = 1 << 6,
}

export enum NetScope {
    Owner,   // Jogadores
    Local,   // Entidades que só aparecem perto
    Global,  // Entidades que estão sempre no mapa
}

export enum InputMap {
    Up      = 1 <<  0,
    Down    = 1 <<  1,
    Left    = 1 <<  2,
    Right   = 1 <<  3,
    Jump    = 1 <<  4,
    Action1 = 1 <<  5,
    Action2 = 1 <<  6,
    Action3 = 1 <<  7,
}