import { Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/algorithmHelpers';

type PrimStep = {
  current: Cell;
  openSet: Cell[];
  closedSet: Cell[];
  path: Cell[];
};

export async function* prim(grid: Grid, start: Cell, end: Cell): AsyncGenerator<PrimStep> {
  const openSet: Cell[] = [start];
  const closedSet: Cell[] = [];
  const cameFrom = new Map<string, Cell>();
  const weights = new Map<string, number>();

  weights.set(start.id, 0);

  while (openSet.length > 0) {
    // Find the node with the lowest weight
    let current = openSet[0];
    let lowestWeight = weights.get(current.id) || Infinity;

    for (let i = 1; i < openSet.length; i++) {
      const weight = weights.get(openSet[i].id) || Infinity;
      if (weight < lowestWeight) {
        lowestWeight = weight;
        current = openSet[i];
      }
    }

    // If we reached the end, reconstruct and return the path
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
        openSet,
        closedSet,
        path,
      };
      return;
    }

    // Move current from openSet to closedSet
    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    // Get neighbors
    const neighbors = getNeighbors(grid, current);

    for (const neighbor of neighbors) {
      if (closedSet.some(c => c.id === neighbor.id)) {
        continue;
      }

      const weight = neighbor.weight;

      if (!openSet.some(c => c.id === neighbor.id)) {
        openSet.push(neighbor);
        weights.set(neighbor.id, weight);
        cameFrom.set(neighbor.id, current);
      } else if (weight < (weights.get(neighbor.id) || Infinity)) {
        weights.set(neighbor.id, weight);
        cameFrom.set(neighbor.id, current);
      }
    }

    yield {
      current,
      openSet: [...openSet],
      closedSet: [...closedSet],
      path: [],
    };
  }

  // No path found
  yield {
    current: start,
    openSet: [],
    closedSet,
    path: [],
  };
} 