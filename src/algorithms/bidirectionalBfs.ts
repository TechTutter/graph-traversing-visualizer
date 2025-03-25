import { Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/algorithmHelpers';

type BidirectionalBFSStep = {
  current: Cell;
  queue: Cell[];
  visited: Set<string>;
  path: Cell[];
  isForward: boolean;
};

export async function* bidirectionalBfs(grid: Grid, start: Cell, end: Cell): AsyncGenerator<BidirectionalBFSStep> {
  const forwardQueue: Cell[] = [start];
  const backwardQueue: Cell[] = [end];
  const forwardVisited = new Set<string>([start.id]);
  const backwardVisited = new Set<string>([end.id]);
  const forwardCameFrom = new Map<string, Cell>();
  const backwardCameFrom = new Map<string, Cell>();

  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Forward search
    const current = forwardQueue.shift()!;

    // Check if we've found a meeting point
    if (backwardVisited.has(current.id)) {
      // Reconstruct path from both directions
      const path: Cell[] = [];

      // Forward path
      let curr = current;
      while (forwardCameFrom.has(curr.id)) {
        path.unshift(curr);
        curr = forwardCameFrom.get(curr.id)!;
      }
      path.unshift(start);

      // Backward path
      curr = current;
      while (backwardCameFrom.has(curr.id)) {
        curr = backwardCameFrom.get(curr.id)!;
        path.push(curr);
      }

      yield {
        current,
        queue: forwardQueue,
        visited: forwardVisited,
        path,
        isForward: true,
      };
      return;
    }

    // Process forward neighbors
    const forwardNeighbors = getNeighbors(grid, current);
    for (const neighbor of forwardNeighbors) {
      if (!forwardVisited.has(neighbor.id)) {
        forwardVisited.add(neighbor.id);
        forwardQueue.push(neighbor);
        forwardCameFrom.set(neighbor.id, current);
      }
    }

    yield {
      current,
      queue: [...forwardQueue],
      visited: forwardVisited,
      path: [],
      isForward: true,
    };

    // Backward search
    if (backwardQueue.length > 0) {
      const current = backwardQueue.shift()!;

      // Check if we've found a meeting point
      if (forwardVisited.has(current.id)) {
        // Reconstruct path from both directions
        const path: Cell[] = [];

        // Forward path to meeting point
        let curr = current;
        while (forwardCameFrom.has(curr.id)) {
          path.unshift(curr);
          curr = forwardCameFrom.get(curr.id)!;
        }
        path.unshift(start);

        // Backward path from meeting point
        curr = current;
        while (backwardCameFrom.has(curr.id)) {
          curr = backwardCameFrom.get(curr.id)!;
          path.push(curr);
        }

        yield {
          current,
          queue: backwardQueue,
          visited: backwardVisited,
          path,
          isForward: false,
        };
        return;
      }

      // Process backward neighbors
      const backwardNeighbors = getNeighbors(grid, current);
      for (const neighbor of backwardNeighbors) {
        if (!backwardVisited.has(neighbor.id)) {
          backwardVisited.add(neighbor.id);
          backwardQueue.push(neighbor);
          backwardCameFrom.set(neighbor.id, current);
        }
      }

      yield {
        current,
        queue: [...backwardQueue],
        visited: backwardVisited,
        path: [],
        isForward: false,
      };
    }
  }

  // No path found
  yield {
    current: start,
    queue: [],
    visited: forwardVisited,
    path: [],
    isForward: true,
  };
} 