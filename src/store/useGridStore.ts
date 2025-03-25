import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { algorithms } from '../algorithms';
import { Algorithm, AnimationConfig, Cell, CellType, Grid, GridConfig } from '../types/grid';
import { createThrottledAnimationFrame } from '../utils/animation';
import { generateId } from '../utils/generateId';

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
  startAlgorithm: () => Promise<AlgorithmResult>;
  stopAlgorithm: () => void;
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
}

export const DEFAULT_CONFIG: GridConfig = {
  rows: 20,
  cols: 30,
  obstaclePercentage: 0.3,
};

const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
  speed: 100,
  isPlaying: false,
};

function createCell(x: number, y: number, type: CellType): Cell {
  return {
    id: generateId(x, y),
    x,
    y,
    type,
    state: 'unvisited',
    weight: 1, // Default weight for unweighted cells
  };
}

type AlgorithmResult = {
  success: boolean;
  steps: number;
};

// Create the store with separate slices
export const useGridStore = create<GridConfigStore & AlgorithmStore & GridDataStore>((set, get) => {
  // Keep animation controller in closure
  let animationController: ReturnType<typeof createThrottledAnimationFrame> | null = null;

  return {
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
      const startX = Math.max(0, Math.floor(Math.random() * cols));
      const startY = Math.max(0, Math.floor(Math.random() * rows));
      const startCell = createCell(startX, startY, 'start');
      newGrid[startY][startX] = startCell;

      // Place end point (right side)
      const endX = Math.max(0, Math.floor(Math.random() * cols));
      const endY = Math.max(0, Math.floor(Math.random() * rows));
      const endCell = createCell(endX, endY, 'end');
      newGrid[endY][endX] = endCell;

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

    startAlgorithm: async (): Promise<AlgorithmResult> => {
      const { grid, startCell, endCell, selectedAlgorithm, animationConfig } = get();

      if (!startCell || !endCell || get().isRunning) return { success: false, steps: 0 };

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

      try {
        let previousCurrent: Cell | null = null;
        let visitedCells = new Set<string>();

        // Create animation controller
        animationController = createThrottledAnimationFrame(animationConfig.speed);

        let steps = 0;
        let foundPath = false;

        const algorithm = algorithms[selectedAlgorithm];
        if (!algorithm) {
          return { success: false, steps: 0 };
        }

        for await (const step of algorithm(newGrid, startCell, endCell)) {
          if (!get().isRunning) {
            return { success: false, steps };
          }

          steps++;

          // Update cell states
          if (step.visited) {
            step.visited.forEach(cell => {
              get().setCellState(cell.x, cell.y, 'visited');
            });
          }

          if (step.current) {
            get().setCellState(step.current.x, step.current.y, 'current');
          }

          if (step.path.length > 0) {
            step.path.forEach(cell => {
              if (cell.type !== 'start' && cell.type !== 'end') {
                get().setCellState(cell.x, cell.y, 'path');
              }
            });
            get().stopAlgorithm();
            return { success: true, steps };
          }

          await new Promise(resolve => setTimeout(resolve, animationConfig.speed));
        }
      } finally {
        if (animationController) {
          animationController.cancel();
          animationController = null;
        }
        set({ isRunning: false });
      }
      return { success: false, steps };
    },

    stopAlgorithm: () => {
      if (animationController) {
        animationController.cancel();
        animationController = null;
      }
      set({ isRunning: false });
    },
  };
});

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