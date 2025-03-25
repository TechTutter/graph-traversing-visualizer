import { Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/algorithmHelpers';

type BFSStep = {
  current: Cell;
  queue: Cell[];
  visited: Set<string>;
  path: Cell[];
};

export async function* bfs(grid: Grid, start: Cell, end: Cell): AsyncGenerator<BFSStep> {
  const queue: Cell[] = [start];
  const visited = new Set<string>();
  const cameFrom = new Map<string, Cell>();

  visited.add(start.id);

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
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
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