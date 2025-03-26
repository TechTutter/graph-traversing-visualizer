import { Cell, Grid, GridConfig } from '../types/grid';

export function getNeighbors(grid: Grid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  const directions = [
    [-1, 0], // left
    [1, 0],  // right
    [0, -1], // up
    [0, 1],  // down
  ];

  for (const [dx, dy] of directions) {
    const newX = cell.x + dx;
    const newY = cell.y + dy;

    if (
      newX >= 0 &&
      newX < grid[0].length &&
      newY >= 0 &&
      newY < grid.length &&
      grid[newY][newX].type !== 'blocked'
    ) {
      neighbors.push(grid[newY][newX]);
    }
  }

  return neighbors;
}

export function calculateGridConfig(config: GridConfig): GridConfig {
  const maxRows = Math.floor(window.innerHeight / 30); // 30px per cell
  const maxCols = Math.floor(window.innerWidth / 30);

  return {
    ...config,
    rows: Math.min(config.rows, maxRows),
    cols: Math.min(config.cols, maxCols),
  };
}