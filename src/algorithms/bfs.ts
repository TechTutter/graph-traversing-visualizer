import { AlgorithmStep, Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/grid';

type BFSStep = AlgorithmStep;

export async function* bfs(grid: Grid, start: Cell, end: Cell): AsyncGenerator<BFSStep, void, unknown> {
  const queue: Cell[] = [start];
  const visited: Cell[] = [];
  const cameFrom = new Map<string, Cell>();

  visited.push(start);

  while (queue.length > 0) {
    const current = queue.shift()!;

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
        queue,
        visited,
        path,
      };
      return;
    }

    // Get neighbors
    const neighbors = getNeighbors(grid, current);

    // Process each unvisited neighbor
    for (const neighbor of neighbors) {
      if (!visited.some(c => c.id === neighbor.id)) {
        visited.push(neighbor);
        queue.push(neighbor);
        cameFrom.set(neighbor.id, current);
      }
    }

    yield {
      current,
      queue: [...queue],
      visited,
      path: [],
    };
  }

  // No path found
  yield {
    current: start,
    queue: [],
    visited,
    path: [],
  };
} 