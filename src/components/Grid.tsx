import { memo, useEffect } from 'react';
import { useGridData } from '../store/useGridStore';
import { Cell as CellType } from '../types/grid';
import Cell from './Cell';

// Memoized row component to prevent unnecessary rerenders
const GridRow = memo(function GridRow({ row }: { row: CellType[] }) {
  return (
    <div className="flex gap-0">
      {row.map((cell) => (
        <Cell key={cell.id} cell={cell} />
      ))}
    </div>
  );
});

function Grid() {
  const { grid, initializeGrid, gridConfig } = useGridData();

  useEffect(() => {
    if (!grid.length) {
      initializeGrid(gridConfig);
    }
  }, []); // Empty dependency array since we only want to initialize once

  if (!grid.length) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-0">
      {grid.map((row, y) => (
        <GridRow key={y} row={row} />
      ))}
    </div>
  );
}

export default memo(Grid);
