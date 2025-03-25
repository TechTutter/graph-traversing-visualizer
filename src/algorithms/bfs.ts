import { Cell, Grid } from '../types/grid';
import { getNeighbors, reconstructPath } from '../utils/algorithmHelpers';

type BFSStep = {
  current: Cell;
  queue: Cell[];
  visited: Set<string>;
  path: Cell[];
};

export function bfs(
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep?: (step: BFSStep) => void
): Cell[] {
  const queue: Cell[] = [start];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const current = queue.shift()!;

    // If we found the end, return the path
    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(current);
      onStep?.({
        current,
        queue,
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
        visited.add(neighborId);
        queue.push({
          ...neighbor,
          parent: current,
        });
      }
    }

    // Notify step
    onStep?.({
      current,
      queue,
      visited,
      path: [],
    });
  }

  // No path found
  return [];
} 