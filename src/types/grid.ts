export type CellType = 'traversable' | 'blocked' | 'start' | 'end';

export type CellState =
  | 'unvisited'
  | 'neighbor'     // Newly discovered unvisited neighbor
  | 'current'      // Currently being processed
  | 'visited'      // Already processed
  | 'path';        // Part of the final path

export type Cell = {
  id: string;
  x: number;
  y: number;
  type: CellType;
  state: CellState;
  weight: number;  // for weighted algorithms like Dijkstra's
  f?: number; // for A* algorithm
  g?: number; // for A* algorithm
  h?: number; // for A* algorithm
  parent?: Cell; // for path reconstruction
}

export type Grid = Cell[][];

export type Algorithm =
  | 'astar'
  | 'dfs'
  | 'bfs'
  | 'dijkstra'
  | 'bidirectionalBfs'
  | 'prim';

export type GridConfig = {
  rows: number;
  cols: number;
  obstaclePercentage: number;
}

export type AnimationConfig = {
  speed: number; // milliseconds between steps
  isPlaying: boolean;
} 