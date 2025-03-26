import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Algorithm } from '../types/grid';
import { Legend } from './Legend';

type HeaderProps = {
  selectedAlgorithm: Algorithm;
  isRunning: boolean;
  speed: number;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onPlayPause: () => void;
  canPlay: boolean;
};

export function Header({
  selectedAlgorithm,
  isRunning,
  speed,
  onAlgorithmChange,
  onSpeedChange,
  onReset,
  onPlayPause,
  canPlay,
}: HeaderProps) {
  const [showLegend, setShowLegend] = useState(false);
  const [localSpeed, setLocalSpeed] = useState(speed);

  // Create memoized debounced function
  const debouncedSpeedChange = useMemo(() => debounce((value: number) => onSpeedChange(value), 200), [onSpeedChange]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSpeedChange.cancel();
    };
  }, [debouncedSpeedChange]);

  const handleSpeedChange = useCallback(
    (value: number) => {
      setLocalSpeed(value);
      debouncedSpeedChange(value);
    },
    [debouncedSpeedChange],
  );

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Left section - Algorithm selector */}
        <div className="flex items-center gap-4">
          <select
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            className="hidden md:block rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
            disabled={isRunning}>
            <optgroup label="Shortest Path">
              <option value="astar">A*</option>
              <option value="dijkstra">Dijkstra</option>
            </optgroup>
            <optgroup label="Search">
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
              <option value="bidirectionalBfs">Bi-BFS</option>
            </optgroup>
            <optgroup label="Maze">
              <option value="prim">Prim</option>
            </optgroup>
          </select>

          {/* Speed control */}
          <div className="hidden md:flex items-center gap-2">
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={localSpeed}
              disabled={isRunning}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-24 disabled:opacity-30"
            />
          </div>
        </div>

        {/* Center section - Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"
            disabled={isRunning}
            title="Shuffle Grid">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <button
            onClick={onPlayPause}
            className={`p-2 rounded-lg text-white ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            } disabled:opacity-30`}
            disabled={!canPlay && !isRunning}
            title={isRunning ? 'Stop' : 'Play'}>
            {isRunning ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Show Legend">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden border-t border-gray-200 bg-white p-4">
        <div className="space-y-4">
          <select
            value={selectedAlgorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as Algorithm)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:opacity-50"
            disabled={isRunning}>
            <optgroup label="Shortest Path">
              <option value="astar">A*</option>
              <option value="dijkstra">Dijkstra</option>
            </optgroup>
            <optgroup label="Search">
              <option value="bfs">BFS</option>
              <option value="dfs">DFS</option>
              <option value="bidirectionalBfs">Bi-BFS</option>
            </optgroup>
            <optgroup label="Maze">
              <option value="prim">Prim</option>
            </optgroup>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={localSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      {/* Legend popup */}
      {showLegend && (
        <div className="absolute top-16 right-4 z-50">
          <Legend variant="popup" />
        </div>
      )}
    </header>
  );
}
