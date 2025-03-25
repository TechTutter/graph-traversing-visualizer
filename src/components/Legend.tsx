import { memo } from 'react';

function Legend() {
  const items = [
    { color: 'bg-white border-gray-300', label: 'Unvisited', description: 'Cell that has not been discovered yet' },
    { color: 'bg-yellow-100 border-yellow-300', label: 'Neighbor', description: 'Newly discovered unvisited neighbor' },
    { color: 'bg-yellow-400 border-yellow-500', label: 'Current', description: 'Cell currently being processed' },
    { color: 'bg-orange-200 border-orange-300', label: 'Visited', description: 'Cell that has been processed' },
    { color: 'bg-green-300 border-green-400', label: 'Path', description: 'Part of the final shortest path' },
    { color: 'bg-gray-800 border-gray-900', label: 'Blocked', description: 'Obstacle that cannot be traversed' },
    { color: 'bg-blue-500 border-blue-600', label: 'Start', description: 'Starting point' },
    { color: 'bg-green-500 border-green-600', label: 'End', description: 'Target destination' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
      {items.map(({ color, label, description }) => (
        <div key={label} className="relative group flex items-center gap-1">
          <div className={`w-4 h-4 border ${color}`} />
          <span className="text-xs text-gray-600">{label}</span>

          {/* Tooltip */}
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {description}
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(Legend);
