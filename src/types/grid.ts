export type CellType = 'start' | 'end' | 'blocked' | 'traversable';

export type CellState = 'unvisited' | 'visited' | 'current' | 'path' | 'neighbor';

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

export type AlgorithmStep = {
  current: Cell;
  visited?: Cell[];
  openSet?: Cell[];
  closedSet?: Cell[];
  stack?: Cell[];
  queue?: Cell[];
  path: Cell[];
  isForward?: boolean;
};

export type AlgorithmResult = {
  success: boolean;
  steps: number;
  visitedNodes: number;
}; 