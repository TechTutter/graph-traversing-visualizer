import { Cell, Grid } from '../types/grid';

export function getNeighbors(grid: Grid, cell: Cell): Cell[] {
  const neighbors: Cell[] = [];
  const { x, y } = cell;
  const directions = [
    [0, 1],  // right
    [1, 0],  // down
    [0, -1], // left
    [-1, 0], // up
  ];

  for (const [dx, dy] of directions) {
    const newX = x + dx;
    const newY = y + dy;

    if (
      newY >= 0 &&
      newY < grid.length &&
      newX >= 0 &&
      newX < grid[0].length &&
      grid[newY][newX].type !== 'blocked'
    ) {
      neighbors.push(grid[newY][newX]);
    }
  }

  return neighbors;
}

export function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function reconstructPath(endCell: Cell): Cell[] {
  const path: Cell[] = [];
  let current: Cell | undefined = endCell;

  while (current) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
} 