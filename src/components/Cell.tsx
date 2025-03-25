import { memo } from 'react';
import { Cell as CellType } from '../types/grid';
import { cn } from '../utils/cn';

type CellProps = {
  cell: CellType;
  onClick?: () => void;
};

function Cell({ cell, onClick }: CellProps) {
  const cellClasses = cn('w-4 h-4 border transition-colors duration-200', {
    // Base cell types
    'bg-white border-gray-300': cell.type === 'traversable' && cell.state === 'unvisited',
    'bg-gray-800 border-gray-900': cell.type === 'blocked',
    'bg-blue-500 border-blue-600': cell.type === 'start',
    'bg-green-500 border-green-600': cell.type === 'end',

    // Algorithm states
    'bg-yellow-100 border-yellow-300': cell.state === 'neighbor', // Newly discovered
    'bg-yellow-400 border-yellow-500': cell.state === 'current', // Currently processing
    'bg-orange-200 border-orange-300': cell.state === 'visited', // Already visited
    'bg-green-300 border-green-400': cell.state === 'path', // Final path
  });

  return (
    <div
      className={cellClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Cell at position (${cell.x}, ${cell.y})`}
    />
  );
}

export default memo(Cell);
