import { Cell, Grid } from '../types/grid';
import { getNeighbors, reconstructPath } from '../utils/algorithmHelpers';

type PrimStep = {
  current: Cell;
  openSet: Cell[];
  closedSet: Cell[];
  path: Cell[];
};

export function prim(
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep?: (step: PrimStep) => void
): Cell[] {
  const openSet: Cell[] = [{ ...start, weight: 0 }];
  const closedSet: Cell[] = [];
  const weights = new Map<string, number>();
  weights.set(`${start.x},${start.y}`, 0);

  while (openSet.length > 0) {
    // Find node with minimum weight
    let current = openSet[0];
    let currentIndex = 0;

    openSet.forEach((node, index) => {
      const nodeWeight = weights.get(`${node.x},${node.y}`)!;
      const currentWeight = weights.get(`${current.x},${current.y}`)!;
      if (nodeWeight < currentWeight) {
        current = node;
        currentIndex = index;
      }
    });

    // If we reached the end, return the path
    if (current.x === end.x && current.y === end.y) {
      const path = reconstructPath(current);
      onStep?.({ current, openSet, closedSet, path });
      return path;
    }

    // Remove current from openSet and add to closedSet
    openSet.splice(currentIndex, 1);
    closedSet.push(current);

    // Check all neighbors
    const neighbors = getNeighbors(grid, current);
    const currentWeight = weights.get(`${current.x},${current.y}`)!;

    for (const neighbor of neighbors) {
      const neighborId = `${neighbor.x},${neighbor.y}`;

      // Skip if neighbor is in closedSet
      if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue;
      }

      const weight = currentWeight + 1; // Using uniform weight of 1

      if (!weights.has(neighborId) || weight < weights.get(neighborId)!) {
        weights.set(neighborId, weight);
        const openNeighbor = openSet.find(
          node => node.x === neighbor.x && node.y === neighbor.y
        );

        if (!openNeighbor) {
          openSet.push({
            ...neighbor,
            parent: current,
          });
        } else {
          openNeighbor.parent = current;
        }
      }
    }

    // Notify step
    onStep?.({ current, openSet, closedSet, path: [] });
  }

  // No path found
  return [];
} 