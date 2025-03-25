import { Cell, Grid } from '../types/grid';

export function getNeighbors(grid: Grid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;
  const directions = [
    [-1, 0], // left
    [1, 0],  // right
    [0, -1], // up
    [0, 1],  // down
  ];

  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;

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