type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const PLAYER_COLORS: Record<PlayerColor, { name: string, bg: string, lightBg: string, darkBg: string, border: string }> = {
  red:    { name: 'Red',    bg: 'bg-red-500',    lightBg: 'bg-red-200',    darkBg: 'bg-red-600',    border: 'border-red-700' },
  green:  { name: 'Green',  bg: 'bg-green-500',  lightBg: 'bg-green-200',  darkBg: 'bg-green-600',  border: 'border-green-700' },
  yellow: { name: 'Yellow', bg: 'bg-yellow-400', lightBg: 'bg-yellow-200', darkBg: 'bg-yellow-500', border: 'border-yellow-600' },
  blue:   { name: 'Blue',   bg: 'bg-blue-500',   lightBg: 'bg-blue-200',   darkBg: 'bg-blue-600',   border: 'border-blue-700' },
};

export type GridPos = { row: number; col: number };
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

// --- Game Logic Constants ---
export const START_POS = 0;
export const HOME_PATH_START_POS = 50;
export const FINISHED_POS = 56; // 50 (main) + 6 (home)

// --- Board Rendering Constants ---

// This is the absolute path for all players. Rotations are applied later.
const ABSOLUTE_PATH: GridPos[] = [
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
    {row: 8, col: 1} // Path index 51, red home entry point
];

const HOME_PATHS: Record<PlayerColor, GridPos[]> = {
    red:    [{row: 8, col: 2}, {row: 8, col: 3}, {row: 8, col: 4}, {row: 8, col: 5}, {row: 8, col: 6}, {row: 8, col: 7}],
    green:  [{row: 2, col: 8}, {row: 3, col: 8}, {row: 4, col: 8}, {row: 5, col: 8}, {row: 6, col: 8}, {row: 7, col: 8}],
    yellow: [{row: 8, col: 14}, {row: 8, col: 13}, {row: 8, col: 12}, {row: 8, col: 11}, {row: 8, col: 10}, {row: 8, col: 9}],
    blue:   [{row: 14, col: 8}, {row: 13, col: 8}, {row: 12, col: 8}, {row: 11, col: 8}, {row: 10, col: 8}, {row: 9, col: 8}],
};

const SAFE_SQUARES_GRID: GridPos[] = [
    ABSOLUTE_PATH[0],  // Red start
    ABSOLUTE_PATH[8],
    ABSOLUTE_PATH[13], // Green start
    ABSOLUTE_PATH[21],
    ABSOLUTE_PATH[26], // Yellow start
    ABSOLUTE_PATH[34],
    ABSOLUTE_PATH[39], // Blue start
    ABSOLUTE_PATH[47],
];

export function isSafeSquare(gridPos: GridPos): boolean {
    return !!SAFE_SQUARES_GRID.find(p => p.row === gridPos.row && p.col === gridPos.col);
}

export const BOARD_LAYOUT: Cell[] = [
  // Bases
  { id: 'red-base',    type: 'base', color: 'red',    row: 1, col: 1,  span: { row: 6, col: 6 }, itemPositions: [{row: 2, col: 2}, {row: 2, col: 5}, {row: 5, col: 2}, {row: 5, col: 5}] },
  { id: 'green-base',  type: 'base', color: 'green',  row: 1, col: 10, span: { row: 6, col: 6 }, itemPositions: [{row: 2, col: 11}, {row: 2, col: 14}, {row: 5, col: 11}, {row: 5, col: 14}] },
  { id: 'blue-base',   type: 'base', color: 'blue',   row: 10, col: 1, span: { row: 6, col: 6 }, itemPositions: [{row: 11, col: 2}, {row: 11, col: 5}, {row: 14, col: 2}, {row: 14, col: 5}] },
  { id: 'yellow-base', type: 'base', color: 'yellow', row: 10, col: 10,span: { row: 6, col: 6 }, itemPositions: [{row: 11, col: 11}, {row: 11, col: 14}, {row: 14, col: 11}, {row: 14, col: 14}] },
  
  // Home Finish
  { id: 'home-finish', type: 'home-finish', row: 7, col: 7, span: { row: 3, col: 3 }, itemPositions: [{row:7, col: 7}, {row:9, col: 7}, {row:7, col: 9}, {row:9, col: 9}]},
];

// Add path cells to layout
ABSOLUTE_PATH.forEach((pos, i) => {
    BOARD_LAYOUT.push({
        id: `path-main-${i}`,
        type: 'path',
        row: pos.row,
        col: pos.col,
        isSafe: isSafeSquare(pos),
    });
});

// Add home path cells to layout
(Object.keys(HOME_PATHS) as PlayerColor[]).forEach(color => {
    HOME_PATHS[color].forEach((pos, i) => {
        BOARD_LAYOUT.push({
            id: `${color}-h${i + 1}`,
            type: 'home-path',
            color: color,
            row: pos.row,
            col: pos.col,
            isSafe: true,
        });
    });
});


// --- Logical Path Mappings for Player Movement ---
const createPlayerPath = (startIdx: number, path: GridPos[]) => {
    const mainPath = [...path.slice(startIdx), ...path.slice(0, startIdx)];
    // The 52nd square is the entry to the home path.
    // So the logical path for a player is their 51 squares + their home path.
    return mainPath.slice(0, 51);
}

const START_INDICES: Record<PlayerColor, number> = { red: 0, green: 13, yellow: 26, blue: 39 };

// PATH_MAP takes a player's logical position (0-50) and returns the GridPos on the board.
export const PATH_MAP: Record<PlayerColor, GridPos[]> = {
    red: createPlayerPath(START_INDICES.red, ABSOLUTE_PATH),
    green: createPlayerPath(START_INDICES.green, ABSOLUTE_PATH),
    yellow: createPlayerPath(START_INDICES.yellow, ABSOLUTE_PATH),
    blue: createPlayerPath(START_INDICES.blue, ABSOLUTE_PATH),
};
