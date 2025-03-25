import { useState } from 'react';
import { LEGEND_ITEMS } from '../constants/colors';
import { Algorithm } from '../types/grid';

type HeaderProps = {
  selectedAlgorithm: Algorithm;
  isRunning: boolean;
  speed: number;
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
  onPlayPause: () => void;
};

export function Header({
  selectedAlgorithm,
  isRunning,
  speed,
  onAlgorithmChange,
  onSpeedChange,
  onReset,
  onPlayPause,
}: HeaderProps) {
  const [showLegend, setShowLegend] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Left section */}
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button onClick={() => setShowMenu(!showMenu)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Algorithm selector - hidden on mobile */}
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

          {/* Speed slider - hidden on mobile */}
          <div className="hidden md:flex items-center gap-2">
            <input
              type="range"
              min={20}
              max={1000}
              step={10}
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-24 disabled:opacity-50"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Center section - Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
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
            }`}
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
      {showMenu && (
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
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="flex-1 disabled:opacity-50"
                disabled={isRunning}
              />
            </div>
          </div>
        </div>
      )}

      {/* Legend popup */}
      {showLegend && (
        <div className="absolute top-full right-0 mt-2 mr-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs">
          <div className="grid grid-cols-2 gap-3">
            {LEGEND_ITEMS.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-4 h-4 border border-gray-300 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
