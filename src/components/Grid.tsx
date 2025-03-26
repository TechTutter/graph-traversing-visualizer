import React, { useCallback, useEffect } from 'react';
import { useGridData, useGridStore } from '../store/useGridStore';
import { calculateGridConfig } from '../utils/grid';
import Cell from './Cell';

type GridProps = {
  cellSize: number;
};

function Grid({ cellSize }: GridProps) {
  const { grid, initializeGrid, gridConfig } = useGridData();

  const handleResize = useCallback(() => {
    const { gridConfig } = useGridStore.getState();
    const newConfig = calculateGridConfig(gridConfig);
    useGridStore.getState().setGridConfig(newConfig);
    useGridStore.getState().stopAlgorithm();
    useGridStore.getState().resetGrid();
  }, []);

  useEffect(() => {
    initializeGrid(gridConfig);
  }, [gridConfig, initializeGrid]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return (
    <div className="relative">
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length || 0}, ${cellSize}px)`,
        }}>
        {grid.map((row) =>
          row.map((cell) => (
            <Cell key={cell.id} cell={cell} size={cellSize} onClick={() => {}} onMouseEnter={() => {}} />
          )),
        )}
      </div>
    </div>
  );
}

export default React.memo(Grid);
