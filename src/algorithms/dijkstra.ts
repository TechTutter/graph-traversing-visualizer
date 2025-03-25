import { AlgorithmStep, Cell, Grid } from '../types/grid';
import { getNeighbors } from '../utils/grid';

type DijkstraStep = AlgorithmStep;

export async function* dijkstra(grid: Grid, start: Cell, end: Cell): AsyncGenerator<DijkstraStep, void, unknown> {
  const openSet: Cell[] = [start];
  const closedSet: Cell[] = [];
  const cameFrom = new Map<string, Cell>();
  const gScore = new Map<string, number>();

  gScore.set(start.id, 0);

  while (openSet.length > 0) {
    // Find the node with the lowest gScore
    let current = openSet[0];
    let lowestGScore = gScore.get(current.id) || Infinity;

    for (let i = 1; i < openSet.length; i++) {
      const g = gScore.get(openSet[i].id) || Infinity;
      if (g < lowestGScore) {
        lowestGScore = g;
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

      const tentativeGScore = (gScore.get(current.id) || 0) + neighbor.weight;

      if (!openSet.some(c => c.id === neighbor.id)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= (gScore.get(neighbor.id) || Infinity)) {
        continue;
      }

      cameFrom.set(neighbor.id, current);
      gScore.set(neighbor.id, tentativeGScore);
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