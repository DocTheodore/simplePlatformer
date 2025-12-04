import { INPUT, MOUSE_ID } from "../constants.js";

// shared/types/entities
export type EntityId = string;
export type Mouse = { id: MOUSE_ID, pos: Position };

// === COMPONENTS ===
export interface Position   {x: number, y: number}
export interface Velocity   {x: number, y: number}
export interface Facing     {left: boolean}
export interface OnGround   {value: boolean}
export interface Health     {current: number, max: number}
export interface Color      {value: string}
export interface InputKey   {pressed: INPUT[], clicked: INPUT[]}
export interface InputMouse {pressed: Mouse[], clicked: Mouse[] }
export interface PlayerTag  { }
export interface ChunkPos   {x: number, y: number}

export type Components = {
    position?: Position   
    velocity?: Velocity   
    facing?: Facing     
    onGround?: OnGround   
    health?: Health     
    color?: Color      
    inputKey?: InputKey   
    inputMouse?: InputMouse 
    playerTag?: PlayerTag  
    chunkPos?: ChunkPos   
};

export const C = {
    Position: 'position',
    Velocity: 'velocity',
    Facing: 'facing',
    OnGround: 'onGround',
    Health: 'health',
    Color: 'color',
    InputKey: 'inputKey',
    InputMouse: 'inputMouse',
    PlayerTag: 'playerTag',
    ChunkPos: 'chunkPos',
}
