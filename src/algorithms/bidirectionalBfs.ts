import { Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/algorithmHelpers';

type BidirectionalBFSStep = {
  current: Cell;
  queue: Cell[];
  visited: Set<string>;
  path: Cell[];
  isForward: boolean;
};

export function bidirectionalBfs(
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep?: (step: BidirectionalBFSStep) => void
): Cell[] {
  // Forward search from start
  const forwardQueue: Cell[] = [start];
  const forwardVisited = new Map<string, Cell>();
  forwardVisited.set(`${start.x},${start.y}`, start);

  // Backward search from end
  const backwardQueue: Cell[] = [end];
  const backwardVisited = new Map<string, Cell>();
  backwardVisited.set(`${end.x},${end.y}`, end);

  while (forwardQueue.length > 0 && backwardQueue.length > 0) {
    // Forward search step
    const current = forwardQueue.shift()!;
    const currentId = `${current.x},${current.y}`;

    // Check if we've found a meeting point
    if (backwardVisited.has(currentId)) {
      const path = reconstructBidirectionalPath(current, backwardVisited.get(currentId)!);
      onStep?.({
        current,
        queue: forwardQueue,
        visited: new Set(forwardVisited.keys()),
        path,
        isForward: true,
      });
      return path;
    }

    // Process forward neighbors
    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.x},${neighbor.y}`;
      if (!forwardVisited.has(neighborId)) {
        forwardQueue.push(neighbor);
        forwardVisited.set(neighborId, { ...neighbor, parent: current });
      }
    }

    onStep?.({
      current,
      queue: forwardQueue,
      visited: new Set(forwardVisited.keys()),
      path: [],
      isForward: true,
    });

    // Backward search step
    if (backwardQueue.length > 0) {
      const backCurrent = backwardQueue.shift()!;
      const backCurrentId = `${backCurrent.x},${backCurrent.y}`;

      // Check if we've found a meeting point
      if (forwardVisited.has(backCurrentId)) {
        const path = reconstructBidirectionalPath(
          forwardVisited.get(backCurrentId)!,
          backCurrent
        );
        onStep?.({
          current: backCurrent,
          queue: backwardQueue,
          visited: new Set(backwardVisited.keys()),
          path,
          isForward: false,
        });
        return path;
      }

      // Process backward neighbors
      const backNeighbors = getNeighbors(grid, backCurrent);
      for (const neighbor of backNeighbors) {
        const neighborId = `${neighbor.x},${neighbor.y}`;
        if (!backwardVisited.has(neighborId)) {
          backwardQueue.push(neighbor);
          backwardVisited.set(neighborId, { ...neighbor, parent: backCurrent });
        }
      }

      onStep?.({
        current: backCurrent,
        queue: backwardQueue,
        visited: new Set(backwardVisited.keys()),
        path: [],
        isForward: false,
      });
    }
  }

  // No path found
  return [];
}

function reconstructBidirectionalPath(forwardNode: Cell, backwardNode: Cell): Cell[] {
  const forwardPath: Cell[] = [];
  const backwardPath: Cell[] = [];

  // Build path from start to meeting point
  let current: Cell | undefined = forwardNode;
  while (current) {
    forwardPath.unshift(current);
    current = current.parent;
  }

  // Build path from meeting point to end
  current = backwardNode.parent;
  while (current) {
    backwardPath.push(current);
    current = current.parent;
  }

  // Combine paths
  return [...forwardPath, ...backwardPath];
} 