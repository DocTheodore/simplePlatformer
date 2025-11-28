export interface Vect2 {
  x: number;
  y: number;
}

interface Movement {
  pos: Vect2;
  vel: Vect2;
  onGround: boolean;
  facingLeft: boolean;
  lastChunk: Vect2;
}
const __defaultMovement: Movement = {
  pos: {x: 0, y:0},
  vel: {x: 0, y:0},
  onGround: false,
  facingLeft: false,
  lastChunk: {x: 0, y:0},
}

interface Combat {
  health: number;
  maxHealth: number;
  iFrames: number;
}
const __defaultCombat: Combat = {
  health: 100,
  maxHealth: 100,
  iFrames: 0,
}
interface Inventory {
  items: Array<{id: number, count: number}>;
}
interface Stats {
  speed: number;
  color: string;
}
const __defaultStats: Stats = {
  speed: 0,
  color: `hsl(0, 100%, 50%)`,
}
export interface Player {
  Movement: Movement;
  Combat: Combat;
  Inventory: Inventory;
  Stats: Stats;
}
export const __defaultPlayer: Player = {
  Movement: __defaultMovement,
  Combat: __defaultCombat,
  Inventory: {items: []},
  Stats: __defaultStats,
}