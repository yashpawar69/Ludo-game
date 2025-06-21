type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_COLORS: Record<PlayerColor, { name: string, bg: string, lightBg: string, darkBg: string, border: string }> = {
  red:    { name: 'Red',    bg: 'bg-red-500',    lightBg: 'bg-red-200',    darkBg: 'bg-red-600',    border: 'border-red-700' },
  green:  { name: 'Green',  bg: 'bg-green-500',  lightBg: 'bg-green-200',  darkBg: 'bg-green-600',  border: 'border-green-700' },
  yellow: { name: 'Yellow', bg: 'bg-yellow-400', lightBg: 'bg-yellow-200', darkBg: 'bg-yellow-500', border: 'border-yellow-600' },
  blue:   { name: 'Blue',   bg: 'bg-blue-500',   lightBg: 'bg-blue-200',   darkBg: 'bg-blue-600',   border: 'border-blue-700' },
};

type GridPos = { row: number; col: number };
type Cell = {
  id: string;
  type: 'base' | 'path' | 'home-path' | 'home-finish' | 'center';
  row: number;
  col: number;
  span?: GridPos;
  color?: PlayerColor;
  isSafe?: boolean;
  itemPositions?: GridPos[];
};

export const BOARD_LAYOUT: Cell[] = [
  // Bases
  { id: 'red-base',    type: 'base', color: 'red',    row: 1, col: 1,  span: { row: 6, col: 6 }, itemPositions: [{row: 2, col: 2}, {row: 2, col: 5}, {row: 5, col: 2}, {row: 5, col: 5}] },
  { id: 'green-base',  type: 'base', color: 'green',  row: 1, col: 10, span: { row: 6, col: 6 }, itemPositions: [{row: 2, col: 11}, {row: 2, col: 14}, {row: 5, col: 11}, {row: 5, col: 14}] },
  { id: 'blue-base',   type: 'base', color: 'blue',   row: 10, col: 1, span: { row: 6, col: 6 }, itemPositions: [{row: 11, col: 2}, {row: 11, col: 5}, {row: 14, col: 2}, {row: 14, col: 5}] },
  { id: 'yellow-base', type: 'base', color: 'yellow', row: 10, col: 10,span: { row: 6, col: 6 }, itemPositions: [{row: 11, col: 11}, {row: 11, col: 14}, {row: 14, col: 11}, {row: 14, col: 14}] },
  
  // Home Finish
  { id: 'home-finish', type: 'home-finish', row: 7, col: 7, span: { row: 3, col: 3 }, color: 'red' },
];

const pathCells: {type: 'path' | 'home-path', row: number, col: number, color?: PlayerColor, isSafe?: boolean}[] = [
    // Top arm
    { type: 'path', row: 7, col: 1, isSafe: true }, { type: 'path', row: 7, col: 2 }, { type: 'path', row: 7, col: 3 }, { type: 'path', row: 7, col: 4 }, { type: 'path', row: 7, col: 5 }, { type: 'path', row: 7, col: 6 },
    { type: 'path', row: 8, col: 1 }, { type: 'home-path', color: 'red', row: 8, col: 2 }, { type: 'home-path', color: 'red', row: 8, col: 3 }, { type: 'home-path', color: 'red', row: 8, col: 4 }, { type: 'home-path', color: 'red', row: 8, col: 5 }, { type: 'home-path', color: 'red', row: 8, col: 6 },
    { type: 'path', row: 9, col: 1 }, { type: 'path', row: 9, col: 2 }, { type: 'path', row: 9, col: 3 }, { type: 'path', row: 9, col: 4 }, { type: 'path', row: 9, col: 5 }, { type: 'path', row: 9, col: 6 },
    // Right arm
    { type: 'path', row: 1, col: 7 }, { type: 'path', row: 2, col: 7 }, { type: 'path', row: 3, col: 7 }, { type: 'path', row: 4, col: 7 }, { type: 'path', row: 5, col: 7 }, { type: 'path', row: 6, col: 7 },
    { type: 'path', row: 1, col: 8 }, { type: 'home-path', color: 'green', row: 2, col: 8 }, { type: 'home-path', color: 'green', row: 3, col: 8 }, { type: 'home-path', color: 'green', row: 4, col: 8 }, { type: 'home-path', color: 'green', row: 5, col: 8 }, { type: 'home-path', color: 'green', row: 6, col: 8 },
    { type: 'path', row: 1, col: 9, isSafe: true }, { type: 'path', row: 2, col: 9 }, { type: 'path', row: 3, col: 9 }, { type: 'path', row: 4, col: 9 }, { type: 'path', row: 5, col: 9 }, { type: 'path', row: 6, col: 9 },
    // Bottom arm
    { type: 'path', row: 7, col: 10 }, { type: 'path', row: 7, col: 11 }, { type: 'path', row: 7, col: 12 }, { type: 'path', row: 7, col: 13 }, { type: 'path', row: 7, col: 14 }, { type: 'path', row: 7, col: 15 },
    { type: 'path', row: 8, col: 15 }, { type: 'home-path', color: 'yellow', row: 8, col: 14 }, { type: 'home-path', color: 'yellow', row: 8, col: 13 }, { type: 'home-path', color: 'yellow', row: 8, col: 12 }, { type: 'home-path', color: 'yellow', row: 8, col: 11 }, { type: 'home-path', color: 'yellow', row: 8, col: 10 },
    { type: 'path', row: 9, col: 10, isSafe: true }, { type: 'path', row: 9, col: 11 }, { type: 'path', row: 9, col: 12 }, { type: 'path', row: 9, col: 13 }, { type: 'path', row: 9, col: 14 }, { type: 'path', row: 9, col: 15 },
    // Left arm
    { type: 'path', row: 10, col: 9 }, { type: 'path', row: 11, col: 9 }, { type: 'path', row: 12, col: 9 }, { type: 'path', row: 13, col: 9 }, { type: 'path', row: 14, col: 9 }, { type: 'path', row: 15, col: 9 },
    { type: 'path', row: 15, col: 8 }, { type: 'home-path', color: 'blue', row: 14, col: 8 }, { type: 'home-path', color: 'blue', row: 13, col: 8 }, { type: 'home-path', color: 'blue', row: 12, col: 8 }, { type: 'home-path', color: 'blue', row: 11, col: 8 }, { type: 'home-path', color: 'blue', row: 10, col: 8 },
    { type: 'path', row: 10, col: 7 }, { type: 'path', row: 11, col: 7 }, { type: 'path', row: 12, col: 7, isSafe: true }, { type: 'path', row: 13, col: 7 }, { type: 'path', row: 14, col: 7 }, { type: 'path', row: 15, col: 7 },
];

pathCells.forEach((cell, i) => {
    BOARD_LAYOUT.push({ ...cell, id: `${cell.type}-${cell.color || 'main'}-${i}`, span: { row: 1, col: 1 } });
});

// Logical path mappings to grid positions
const RED_PATH: GridPos[] = [
    {row: 7, col: 2}, {row: 7, col: 3}, {row: 7, col: 4}, {row: 7, col: 5}, {row: 7, col: 6},
    {row: 6, col: 7}, {row: 5, col: 7}, {row: 4, col: 7}, {row: 3, col: 7}, {row: 2, col: 7}, {row: 1, col: 7},
    {row: 1, col: 8},
    {row: 1, col: 9}, {row: 2, col: 9}, {row: 3, col: 9}, {row: 4, col: 9}, {row: 5, col: 9}, {row: 6, col: 9},
    {row: 7, col: 10}, {row: 7, col: 11}, {row: 7, col: 12}, {row: 7, col: 13}, {row: 7, col: 14}, {row: 7, col: 15},
    {row: 8, col: 15},
    {row: 9, col: 15}, {row: 9, col: 14}, {row: 9, col: 13}, {row: 9, col: 12}, {row: 9, col: 11}, {row: 9, col: 10},
    {row: 10, col: 9}, {row: 11, col: 9}, {row: 12, col: 9}, {row: 13, col: 9}, {row: 14, col: 9}, {row: 15, col: 9},
    {row: 15, col: 8},
    {row: 15, col: 7}, {row: 14, col: 7}, {row: 13, col: 7}, {row: 12, col: 7}, {row: 11, col: 7}, {row: 10, col: 7},
    {row: 9, col: 6}, {row: 9, col: 5}, {row: 9, col: 4}, {row: 9, col: 3}, {row: 9, col: 2}, {row: 9, col: 1},
    {row: 8, col: 1}
];

const createPath = (startIdx: number, path: GridPos[]) => {
    const p = [...path];
    return [...p.slice(startIdx), ...p.slice(0, startIdx)];
}

const START_POSITIONS = { red: 0, green: 13, blue: 39, yellow: 26 };
const PATHS = {
    red: createPath(START_POSITIONS.red, RED_PATH),
    green: createPath(START_POSITIONS.green, RED_PATH),
    yellow: createPath(START_POSITIONS.yellow, RED_PATH),
    blue: createPath(START_POSITIONS.blue, RED_PATH),
}

// Create a mapping from logical position (0-51) to grid cell for each player
export const PATH_MAP: Record<PlayerColor, GridPos[]> = {
    red: PATHS.red,
    green: PATHS.green,
    yellow: PATHS.yellow,
    blue: PATHS.blue,
};
