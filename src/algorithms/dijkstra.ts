import { Cell, Grid } from '../types/grid';
import { getNeighbors, reconstructPath } from '../utils/algorithmHelpers';

type DijkstraStep = {
  current: Cell;
  openSet: Cell[];
  closedSet: Cell[];
  path: Cell[];
};

export function dijkstra(
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep?: (step: DijkstraStep) => void
): Cell[] {
  const openSet: Cell[] = [{ ...start, g: 0 }];
  const closedSet: Cell[] = [];

  while (openSet.length > 0) {
    // Find node with lowest g score (distance from start)
    let current = openSet[0];
    let currentIndex = 0;

    openSet.forEach((node, index) => {
      if (node.g! < current.g!) {
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

    for (const neighbor of neighbors) {
      // Skip if neighbor is in closedSet
      if (closedSet.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
        continue;
      }

      // Calculate tentative g score
      const tentativeG = current.g! + 1; // Assuming all edges have weight 1

      // Check if neighbor is in openSet
      const openNeighbor = openSet.find(
        node => node.x === neighbor.x && node.y === neighbor.y
      );

      if (!openNeighbor) {
        // Add neighbor to openSet
        openSet.push({
          ...neighbor,
          g: tentativeG,
          parent: current,
        });
      } else if (tentativeG < openNeighbor.g!) {
        // Update neighbor if this path is better
        openNeighbor.g = tentativeG;
        openNeighbor.parent = current;
      }
    }

    // Notify step
    onStep?.({ current, openSet, closedSet, path: [] });
  }

  // No path found
  return [];
} 