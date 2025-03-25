import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { runAlgorithm } from '../algorithms';
import { Algorithm, AnimationConfig, Cell, CellType, Grid, GridConfig } from '../types/grid';

// Split into smaller stores for better performance
type GridConfigStore = {
  gridConfig: GridConfig;
  setGridConfig: (config: GridConfig) => void;
}

type AlgorithmStore = {
  selectedAlgorithm: Algorithm;
  isRunning: boolean;
  animationConfig: AnimationConfig;
  setSelectedAlgorithm: (algorithm: Algorithm) => void;
  setAnimationSpeed: (speed: number) => void;
  setIsRunning: (isRunning: boolean) => void;
}

type GridDataStore = {
  grid: Grid;
  startCell: Cell | null;
  endCell: Cell | null;
  initializeGrid: (config: GridConfig) => void;
  setStartCell: (cell: Cell) => void;
  setEndCell: (cell: Cell) => void;
  setCellState: (x: number, y: number, state: Cell['state']) => void;
  resetGrid: () => void;
  startAlgorithm: () => Promise<void>;
  stopAlgorithm: () => void;
}

const DEFAULT_CONFIG: GridConfig = {
  rows: 40,
  cols: 60,
  obstaclePercentage: 0.3,
};

const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  speed: 100,
  isPlaying: false,
};

function generateId(x: number, y: number): string {
  return `cell-${x}-${y}`;
}

function createCell(x: number, y: number, type: CellType): Cell {
  return {
    id: generateId(x, y),
    x,
    y,
    type,
    state: 'unvisited',
  };
}

// Create the store with separate slices
export const useGridStore = create<GridConfigStore & AlgorithmStore & GridDataStore>((set, get) => ({
  // Config slice
  gridConfig: DEFAULT_CONFIG,
  setGridConfig: (config) => set({ gridConfig: config }),

  // Algorithm slice
  selectedAlgorithm: 'astar',
  isRunning: false,
  animationConfig: DEFAULT_ANIMATION_CONFIG,
  setSelectedAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),
  setAnimationSpeed: (speed) =>
    set((state) => ({
      animationConfig: { ...state.animationConfig, speed },
    })),
  setIsRunning: (isRunning) => set({ isRunning }),

  // Grid data slice
  grid: [],
  startCell: null,
  endCell: null,

  initializeGrid: (config) => {
    const newGrid: Grid = [];
    const { rows, cols, obstaclePercentage } = config;

    // Initialize empty grid
    for (let y = 0; y < rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < cols; x++) {
        row.push(createCell(x, y, 'traversable'));
      }
      newGrid.push(row);
    }

    // Add obstacles randomly
    const totalCells = rows * cols;
    const obstacleCount = Math.floor(totalCells * obstaclePercentage);
    let placedObstacles = 0;

    while (placedObstacles < obstacleCount) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);

      if (newGrid[y][x].type === 'traversable') {
        newGrid[y][x] = createCell(x, y, 'blocked');
        placedObstacles++;
      }
    }

    // Place start point (left side)
    const startY = Math.floor(Math.random() * rows);
    const startCell = createCell(0, startY, 'start');
    newGrid[startY][0] = startCell;

    // Place end point (right side)
    const endY = Math.floor(Math.random() * rows);
    const endCell = createCell(cols - 1, endY, 'end');
    newGrid[endY][cols - 1] = endCell;

    set({ grid: newGrid, startCell, endCell });
  },

  setStartCell: (cell) => set({ startCell: cell }),
  setEndCell: (cell) => set({ endCell: cell }),

  setCellState: (x, y, state) => {
    set((store) => {
      const newGrid = [...store.grid];
      // Only update if state is different to minimize rerenders
      if (newGrid[y][x].state !== state) {
        newGrid[y] = [...newGrid[y]];
        newGrid[y][x] = { ...newGrid[y][x], state };
        return { grid: newGrid };
      }
      return store;
    });
  },

  resetGrid: () => {
    const { gridConfig } = get();
    get().initializeGrid(gridConfig);
  },

  startAlgorithm: async () => {
    const { grid, startCell, endCell, selectedAlgorithm, animationConfig } = get();

    if (!startCell || !endCell || get().isRunning) return;

    set({ isRunning: true });

    // Reset all cells to unvisited except start, end, and blocked cells
    const newGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        state: ['start', 'end', 'blocked'].includes(cell.type)
          ? cell.state
          : 'unvisited',
        parent: undefined,
        f: undefined,
        g: undefined,
        h: undefined,
      }))
    );
    set({ grid: newGrid });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      let previousCurrent: Cell | null = null;

      await runAlgorithm(
        selectedAlgorithm,
        newGrid,
        startCell,
        endCell,
        async (step) => {
          if (!get().isRunning) return;

          const { current, path, openSet, closedSet, queue, stack, visited } = step;

          // Clear previous current node if it exists
          if (previousCurrent &&
            previousCurrent.type !== 'start' &&
            previousCurrent.type !== 'end') {
            get().setCellState(previousCurrent.x, previousCurrent.y, 'visited');
          }

          // First, mark all new neighbors as 'neighbor'
          const neighbors = openSet || queue || stack || [];
          for (const neighbor of neighbors) {
            if (
              neighbor.type !== 'start' &&
              neighbor.type !== 'end' &&
              neighbor.state === 'unvisited'
            ) {
              get().setCellState(neighbor.x, neighbor.y, 'neighbor');
            }
          }

          // Wait a bit to show the neighbors
          await sleep(animationConfig.speed / 2);

          // Mark the current cell as 'current'
          if (current.type !== 'start' && current.type !== 'end') {
            get().setCellState(current.x, current.y, 'current');
          }
          previousCurrent = current;

          // If we found the path, stop the animation and display the path
          if (path.length > 0) {
            path.forEach((cell) => {
              if (cell.type !== 'start' && cell.type !== 'end') {
                get().setCellState(cell.x, cell.y, 'path');
              }
            });
            // Stop the algorithm
            get().stopAlgorithm();
            return;
          }

          // Wait to show the current cell
          await sleep(animationConfig.speed);

          // Mark previously visited cells
          if (closedSet) {
            closedSet.forEach(cell => {
              if (cell.type !== 'start' && cell.type !== 'end' &&
                cell.id !== current.id) {
                get().setCellState(cell.x, cell.y, 'visited');
              }
            });
          } else if (visited) {
            visited.forEach((_, key) => {
              const [x, y] = key.split(',').map(Number);
              const cell = newGrid[y][x];
              if (cell.type !== 'start' && cell.type !== 'end' &&
                !(cell.x === current.x && cell.y === current.y)) {
                get().setCellState(x, y, 'visited');
              }
            });
          }
        }
      );
    } finally {
      set({ isRunning: false });
    }
  },

  stopAlgorithm: () => {
    set({ isRunning: false });
  },
}));

type StoreState = GridConfigStore & AlgorithmStore & GridDataStore;

// Memoized selectors
const gridConfigSelector = (state: StoreState) => state.gridConfig;
const animationConfigSelector = (state: StoreState) => state.animationConfig;
const algorithmStateSelector = (state: StoreState) => ({
  selectedAlgorithm: state.selectedAlgorithm,
  isRunning: state.isRunning,
});
const gridControlsSelector = (state: StoreState) => ({
  resetGrid: state.resetGrid,
  startAlgorithm: state.startAlgorithm,
  stopAlgorithm: state.stopAlgorithm,
  setSelectedAlgorithm: state.setSelectedAlgorithm,
  setAnimationSpeed: state.setAnimationSpeed,
});
const gridDataSelector = (state: StoreState) => ({
  grid: state.grid,
  initializeGrid: state.initializeGrid,
  gridConfig: state.gridConfig,
});

// Custom hooks for optimized selectors
export const useGridConfig = () => useGridStore(useShallow(gridConfigSelector));
export const useAnimationConfig = () => useGridStore(useShallow(animationConfigSelector));
export const useAlgorithmState = () => useGridStore(useShallow(algorithmStateSelector));
export const useGridControls = () => useGridStore(useShallow(gridControlsSelector));
export const useGridData = () => useGridStore(useShallow(gridDataSelector)); 