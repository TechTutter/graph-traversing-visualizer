import { Algorithm, AlgorithmStep, Cell, Grid } from '../types/grid';
import { astar } from './astar';
import { bfs } from './bfs';
import { bidirectionalBfs } from './bidirectionalBfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { prim } from './prim';

type PathfindingAlgorithm = (grid: Grid, start: Cell, end: Cell) => AsyncGenerator<AlgorithmStep, void, unknown>;

export const algorithms: Record<Algorithm, PathfindingAlgorithm> = {
  astar,
  bfs,
  dfs,
  dijkstra,
  bidirectionalBfs,
  prim,
};

export async function runAlgorithm(
  algorithm: Algorithm,
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep: (step: AlgorithmStep) => void
): Promise<Cell[]> {
  const generator = algorithms[algorithm](grid, start, end);
  let lastPath: Cell[] = [];

  try {
    for await (const step of generator) {
      onStep(step);
      if (step.path.length > 0) {
        lastPath = step.path;
      }
    }
  } catch (error) {
    console.error('Error running algorithm:', error);
  }

  return lastPath;
} 