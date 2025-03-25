import React from 'react';
import { CELL_COLORS } from '../constants/colors';
import { CellState, Cell as CellType } from '../types/grid';

type CellProps = {
  cell: CellType;
  onClick: () => void;
  onMouseEnter: () => void;
};

const getBackgroundColor = (type: CellType['type'], state: CellState): string => {
  // First check cell type
  switch (type) {
    case 'start':
      return CELL_COLORS.START;
    case 'end':
      return CELL_COLORS.END;
    case 'blocked':
      return CELL_COLORS.BLOCKED;
    default:
      // Then check cell state
      switch (state) {
        case 'unvisited':
          return CELL_COLORS.UNVISITED;
        case 'visited':
          return CELL_COLORS.VISITED;
        case 'current':
          return CELL_COLORS.CURRENT;
        case 'neighbor':
          return CELL_COLORS.NEIGHBOR;
        case 'path':
          return CELL_COLORS.PATH;
        default:
          return CELL_COLORS.UNVISITED;
      }
  }
};

export function Cell({ cell, onClick, onMouseEnter }: CellProps) {
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        width: '32px',
        height: '32px',
        border: '1px solid #E0E0E0',
        backgroundColor: getBackgroundColor(cell.type, cell.state),
        transition: 'background-color 0.2s ease',
        cursor: 'pointer',
        minWidth: '32px',
        minHeight: '32px',
        display: 'flex',
        flexShrink: 0,
      }}
    />
  );
}

// Prevent unnecessary rerenders
export default React.memo(Cell);
