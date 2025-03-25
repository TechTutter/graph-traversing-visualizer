import { Algorithm, Cell, Grid } from '../types/grid';
import { astar } from './astar';
import { bfs } from './bfs';
import { bidirectionalBfs } from './bidirectionalBfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { prim } from './prim';

type AlgorithmStep = {
  current: Cell;
  visited?: Set<string>;
  openSet?: Cell[];
  closedSet?: Cell[];
  stack?: Cell[];
  queue?: Cell[];
  path: Cell[];
  isForward?: boolean;
};

export function runAlgorithm(
  algorithm: Algorithm,
  grid: Grid,
  start: Cell,
  end: Cell,
  onStep: (step: AlgorithmStep) => void
): Promise<Cell[]> {
  return new Promise((resolve) => {
    let result: Cell[] = [];

    switch (algorithm) {
      case 'astar':
        result = astar(grid, start, end, (step) => {
          onStep({
            current: step.current,
            openSet: step.openSet,
            closedSet: step.closedSet,
            path: step.path,
          });
        });
        break;

      case 'dfs':
        result = dfs(grid, start, end, (step) => {
          onStep({
            current: step.current,
            stack: step.stack,
            visited: step.visited,
            path: step.path,
          });
        });
        break;

      case 'bfs':
        result = bfs(grid, start, end, (step) => {
          onStep({
            current: step.current,
            queue: step.queue,
            visited: step.visited,
            path: step.path,
          });
        });
        break;

      case 'dijkstra':
        result = dijkstra(grid, start, end, (step) => {
          onStep({
            current: step.current,
            openSet: step.openSet,
            closedSet: step.closedSet,
            path: step.path,
          });
        });
        break;

      case 'bidirectionalBfs':
        result = bidirectionalBfs(grid, start, end, (step) => {
          onStep({
            current: step.current,
            queue: step.queue,
            visited: step.visited,
            path: step.path,
            isForward: step.isForward,
          });
        });
        break;

      case 'prim':
        result = prim(grid, start, end, (step) => {
          onStep({
            current: step.current,
            openSet: step.openSet,
            closedSet: step.closedSet,
            path: step.path,
          });
        });
        break;
    }

    resolve(result);
  });
} 