import { AlgorithmStep, Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/grid';

type DFSStep = AlgorithmStep;

export async function* dfs(grid: Grid, start: Cell, end: Cell): AsyncGenerator<DFSStep, void, unknown> {
  const stack: Cell[] = [start];
  const visited: Cell[] = [];
  const cameFrom = new Map<string, Cell>();

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.some(c => c.id === current.id)) {
      visited.push(current);

      // If we found the end, reconstruct and return the path
      if (current.id === end.id) {
        const path: Cell[] = [];
        let curr = current;
        while (cameFrom.has(curr.id)) {
          path.unshift(curr);
          curr = cameFrom.get(curr.id)!;
        }
        path.unshift(start);

        yield {
          current,
          stack,
          visited,
          path,
        };
        return;
      }

      // Get neighbors in reverse order for DFS
      const neighbors = getNeighbors(grid, current).reverse();

      // Process each unvisited neighbor
      for (const neighbor of neighbors) {
        if (!visited.some(c => c.id === neighbor.id)) {
          stack.push(neighbor);
          cameFrom.set(neighbor.id, current);
        }
      }

      yield {
        current,
        stack: [...stack],
        visited,
        path: [],
      };
    }
  }

  // No path found
  yield {
    current: start,
    stack: [],
    visited,
    path: [],
  };
} 