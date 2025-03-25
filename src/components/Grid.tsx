import React from 'react';
import { useGridData } from '../store/useGridStore';
import Cell from './Cell';

type GridProps = {
  cellSize: number;
};

function Grid({ cellSize }: GridProps) {
  const { grid, initializeGrid, gridConfig } = useGridData();

  React.useEffect(() => {
    if (!grid.length) {
      initializeGrid(gridConfig);
    }
  }, [grid.length, initializeGrid, gridConfig]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)]">
      <div className="grid gap-0">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                size={cellSize}
                onClick={() => {}}
                onMouseEnter={() => {}}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
