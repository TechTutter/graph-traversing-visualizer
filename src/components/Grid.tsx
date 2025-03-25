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
    <div className="w-full h-full flex items-center justify-center">
      <div className="grid auto-rows-max content-center">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-nowrap">
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
