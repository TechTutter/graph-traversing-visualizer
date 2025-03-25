import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { algorithms } from '../algorithms';
import { Algorithm, AlgorithmResult, AlgorithmStep, AnimationConfig, Cell, CellType, Grid, GridConfig } from '../types/grid';
import { createThrottledAnimationFrame } from '../utils/animation';

// Split into smaller stores for better performance
type GridConfigStore = {
  gridConfig: GridConfig;
  setGridConfig: (config: GridConfig) => void;
}

type AlgorithmStore = {
  selectedAlgorithm: Algorithm;
  isRunning: boolean;
  animationConfig: AnimationConfig;
  currentStep: number;
  visitedNodes: number;
  algorithmState: {
    grid: Grid;
    generator: AsyncGenerator<AlgorithmStep, void, unknown> | null;
    lastStep: AlgorithmStep | null;
  };
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
  speed: 20,
  isPlaying: false,
};

function createCell(x: number, y: number, type: CellType): Cell {
  return {
    id: `${x}-${y}`,
    x,
    y,
    type,
    state: 'unvisited',
    weight: 1, // Default weight for unweighted cells
  };
}

// Create the store with separate slices
export const useGridStore = create<GridConfigStore & AlgorithmStore & GridDataStore>((set, get) => {
  let animationController: ReturnType<typeof createThrottledAnimationFrame> | null = null;

  return {
    // Config slice
    gridConfig: DEFAULT_CONFIG,
    setGridConfig: (config) => set({ gridConfig: config }),

    // Algorithm slice
    selectedAlgorithm: 'astar',
    isRunning: false,
    animationConfig: DEFAULT_ANIMATION_CONFIG,
    currentStep: 0,
    visitedNodes: 0,
    algorithmState: {
      grid: [],
      generator: null,
      lastStep: null,
    },
    setSelectedAlgorithm: (algorithm) => {
      const { grid } = get();
      // Reset grid states except for start, end, and blocked cells
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
      set({
        selectedAlgorithm: algorithm,
        grid: newGrid,
        currentStep: 0,
        visitedNodes: 0,
        algorithmState: {
          grid: [],
          generator: null,
          lastStep: null,
        }
      });
    },

    setAnimationSpeed: (speed) =>
      set((state) => ({
        animationConfig: { ...state.animationConfig, speed },
      })),

    setIsRunning: (isRunning) => set({ isRunning }),

    startAlgorithm: async (): Promise<AlgorithmResult> => {
      const { grid, startCell, endCell, selectedAlgorithm, animationConfig, algorithmState } = get();

      if (!startCell || !endCell) return { success: false, steps: 0, visitedNodes: 0 };

      // If we have a saved state and generator, resume from there
      if (algorithmState.generator && algorithmState.lastStep && !algorithmState.lastStep.path.length) {
        set({ isRunning: true });
        try {
          let steps = get().currentStep;
          let visitedNodes = get().visitedNodes;

          for await (const step of algorithmState.generator) {
            if (!get().isRunning) {
              set({ algorithmState: { ...algorithmState, lastStep: step } });
              return { success: false, steps, visitedNodes };
            }

            steps++;
            if (step.visited) {
              visitedNodes += step.visited.length;
            }

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
              set({
                isRunning: false,
                algorithmState: { grid: [], generator: null, lastStep: null }
              });
              return { success: true, steps, visitedNodes };
            }

            set({ currentStep: steps, visitedNodes });
            await new Promise(resolve => setTimeout(resolve, animationConfig.speed));
          }
        } finally {
          if (animationController) {
            animationController.cancel();
            animationController = null;
          }
          set({ isRunning: false });
        }
        return { success: false, steps: get().currentStep, visitedNodes: get().visitedNodes };
      }

      // Start new algorithm run
      set({ isRunning: true, currentStep: 0, visitedNodes: 0 });

      // Reset grid states except for start, end, and blocked cells
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
        let steps = 0;
        let visitedNodes = 0;

        const algorithm = algorithms[selectedAlgorithm];
        if (!algorithm) {
          return { success: false, steps: 0, visitedNodes: 0 };
        }

        const generator = algorithm(newGrid, startCell, endCell);
        set({ algorithmState: { grid: newGrid, generator, lastStep: null } });

        for await (const step of generator) {
          if (!get().isRunning) {
            set({ algorithmState: { ...get().algorithmState, lastStep: step } });
            return { success: false, steps, visitedNodes };
          }

          steps++;
          if (step.visited) {
            visitedNodes += step.visited.length;
          }

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
            set({
              isRunning: false,
              algorithmState: { grid: [], generator: null, lastStep: null }
            });
            return { success: true, steps, visitedNodes };
          }

          set({ currentStep: steps, visitedNodes });
          await new Promise(resolve => setTimeout(resolve, animationConfig.speed));
        }
      } finally {
        if (animationController) {
          animationController.cancel();
          animationController = null;
        }
        set({ isRunning: false });
      }
      return { success: false, steps: get().currentStep, visitedNodes: get().visitedNodes };
    },

    stopAlgorithm: () => {
      set({ isRunning: false });
    },

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
  };
});

type StoreState = GridConfigStore & AlgorithmStore & GridDataStore;

// Memoized selectors
const gridConfigSelector = (state: StoreState) => state.gridConfig;
const animationConfigSelector = (state: StoreState) => state.animationConfig;
const algorithmStateSelector = (state: StoreState) => ({
  selectedAlgorithm: state.selectedAlgorithm,
  isRunning: state.isRunning,
  algorithmState: state.algorithmState,
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