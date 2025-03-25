import { Cell, Grid } from '../types/grid';
import { getNeighbors, reconstructPath } from '../utils/algorithmHelpers';

type DFSStep = {
  current: Cell;
  stack: Cell[];
  visited: Set<string>;
  path: Cell[];
};

export function dfs(
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep?: (step: DFSStep) => void
): Cell[] {
  const stack: Cell[] = [start];
  const visited = new Set<string>();

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentId = `${current.x},${current.y}`;

    if (!visited.has(currentId)) {
      visited.add(currentId);

      // If we found the end, return the path
      if (current.x === end.x && current.y === end.y) {
        const path = reconstructPath(current);
        onStep?.({
          current,
          stack,
          visited,
          path,
        });
        return path;
      }

      // Get unvisited neighbors
      const neighbors = getNeighbors(grid, current);
      for (const neighbor of neighbors) {
        const neighborId = `${neighbor.x},${neighbor.y}`;
        if (!visited.has(neighborId)) {
          stack.push({
            ...neighbor,
            parent: current,
          });
        }
      }

      // Notify step
      onStep?.({
        current,
        stack,
        visited,
        path: [],
      });
    }
  }

  // No path found
  return [];
} 