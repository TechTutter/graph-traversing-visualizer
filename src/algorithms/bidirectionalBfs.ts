import { AlgorithmStep, Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/grid';

type BidirectionalBFSStep = AlgorithmStep;

export async function* bidirectionalBfs(grid: Grid, start: Cell, end: Cell): AsyncGenerator<BidirectionalBFSStep, void, unknown> {
  const forwardQueue: Cell[] = [start];
  const backwardQueue: Cell[] = [end];
  const forwardVisited: Cell[] = [start];
  const backwardVisited: Cell[] = [end];
  const forwardCameFrom = new Map<string, Cell>();
  const backwardCameFrom = new Map<string, Cell>();

  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Forward search
    const current = forwardQueue.shift()!;

    // Check if we've found a meeting point
    if (backwardVisited.some(c => c.id === current.id)) {
      const path: Cell[] = [];
      // Reconstruct path from start to meeting point
      let curr = current;
      while (forwardCameFrom.has(curr.id)) {
        path.unshift(curr);
        curr = forwardCameFrom.get(curr.id)!;
      }
      path.unshift(start);

      // Reconstruct path from meeting point to end
      curr = current;
      while (backwardCameFrom.has(curr.id)) {
        curr = backwardCameFrom.get(curr.id)!;
        path.push(curr);
      }

      yield {
        current,
        queue: [...forwardQueue, ...backwardQueue],
        visited: [...forwardVisited, ...backwardVisited],
        path,
        isForward: true,
      };
      return;
    }

    // Get neighbors
    const neighbors = getNeighbors(grid, current);

    // Process each unvisited neighbor
    for (const neighbor of neighbors) {
      if (!forwardVisited.some(c => c.id === neighbor.id)) {
        forwardVisited.push(neighbor);
        forwardQueue.push(neighbor);
        forwardCameFrom.set(neighbor.id, current);
      }
    }

    yield {
      current,
      queue: [...forwardQueue, ...backwardQueue],
      visited: [...forwardVisited, ...backwardVisited],
      path: [],
      isForward: true,
    };

    // Backward search
    if (backwardQueue.length > 0) {
      const backwardCurrent = backwardQueue.shift()!;

      // Check if we've found a meeting point
      if (forwardVisited.some(c => c.id === backwardCurrent.id)) {
        const path: Cell[] = [];
        // Reconstruct path from start to meeting point
        let curr = backwardCurrent;
        while (forwardCameFrom.has(curr.id)) {
          path.unshift(curr);
          curr = forwardCameFrom.get(curr.id)!;
        }
        path.unshift(start);

        // Reconstruct path from meeting point to end
        curr = backwardCurrent;
        while (backwardCameFrom.has(curr.id)) {
          curr = backwardCameFrom.get(curr.id)!;
          path.push(curr);
        }

        yield {
          current: backwardCurrent,
          queue: [...forwardQueue, ...backwardQueue],
          visited: [...forwardVisited, ...backwardVisited],
          path,
          isForward: false,
        };
        return;
      }

      // Get neighbors
      const backwardNeighbors = getNeighbors(grid, backwardCurrent);

      // Process each unvisited neighbor
      for (const neighbor of backwardNeighbors) {
        if (!backwardVisited.some(c => c.id === neighbor.id)) {
          backwardVisited.push(neighbor);
          backwardQueue.push(neighbor);
          backwardCameFrom.set(neighbor.id, backwardCurrent);
        }
      }

      yield {
        current: backwardCurrent,
        queue: [...forwardQueue, ...backwardQueue],
        visited: [...forwardVisited, ...backwardVisited],
        path: [],
        isForward: false,
      };
    }
  }

  // No path found
  yield {
    current: start,
    queue: [],
    visited: [...forwardVisited, ...backwardVisited],
    path: [],
    isForward: true,
  };
} 