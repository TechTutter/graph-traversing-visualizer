import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { useGridStore } from '../store/useGridStore';
import { GridConfig } from '../types/grid';

const HEADER_HEIGHT = 64; // pixels
const MIN_CELL_SIZE = 24; // minimum size for touch targets
const MAX_CELL_SIZE = 40; // maximum size to keep grid looking good

type WindowSize = {
  width: number;
  height: number;
  cellSize: number;
  gridDimensions: GridConfig;
};

function calculateGridDimensions(width: number, height: number, cellSize: number): GridConfig {
  const availableHeight = height - HEADER_HEIGHT;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(availableHeight / cellSize);

  return {
    rows: Math.max(10, rows), // minimum 10 rows
    cols: Math.max(15, cols), // minimum 15 columns
    obstaclePercentage: 0.3,
  };
}

function calculateCellSize(width: number, height: number): number {
  const availableHeight = height - HEADER_HEIGHT;

  // Target having at least 15 columns and 10 rows
  const maxCellWidth = Math.floor(width / 15);
  const maxCellHeight = Math.floor(availableHeight / 10);

  // Use the smaller of the two dimensions to maintain aspect ratio
  let cellSize = Math.min(maxCellWidth, maxCellHeight);

  // Clamp between MIN_CELL_SIZE and MAX_CELL_SIZE
  cellSize = Math.max(MIN_CELL_SIZE, Math.min(cellSize, MAX_CELL_SIZE));

  return cellSize;
}

export function useWindowSize() {
  const stopAlgorithm = useGridStore(state => state.stopAlgorithm);
  const resetGrid = useGridStore(state => state.resetGrid);
  const setGridConfig = useGridStore(state => state.setGridConfig);

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cellSize = calculateCellSize(width, height);
    const gridDimensions = calculateGridDimensions(width, height, cellSize);
    setGridConfig(gridDimensions); // Set initial grid config
    return {
      width,
      height,
      cellSize,
      gridDimensions,
    };
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cellSize = calculateCellSize(width, height);
      const gridDimensions = calculateGridDimensions(width, height, cellSize);

      // Stop any running algorithm and reset the grid with new dimensions
      stopAlgorithm();
      setGridConfig(gridDimensions);
      resetGrid();

      setWindowSize({
        width,
        height,
        cellSize,
        gridDimensions,
      });
    }, 250);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [stopAlgorithm, resetGrid, setGridConfig]);

  return windowSize;
} 