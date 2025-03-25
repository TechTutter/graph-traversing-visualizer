import Grid from './components/Grid';
import Legend from './components/Legend';
import { useAlgorithmState, useAnimationConfig, useGridControls } from './store/useGridStore';
import { Algorithm } from './types/grid';

function App() {
  const { selectedAlgorithm, isRunning } = useAlgorithmState();
  const { resetGrid, startAlgorithm, stopAlgorithm, setSelectedAlgorithm, setAnimationSpeed } = useGridControls();
  const { speed } = useAnimationConfig();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as Algorithm)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 disabled:opacity-50"
              disabled={isRunning}>
              <optgroup label="Shortest Path Algorithms">
                <option value="astar">A* Algorithm</option>
                <option value="dijkstra">Dijkstra's Algorithm</option>
              </optgroup>
              <optgroup label="Search Algorithms">
                <option value="bfs">Breadth First Search</option>
                <option value="dfs">Depth First Search</option>
                <option value="bidirectionalBfs">Bidirectional BFS</option>
              </optgroup>
              <optgroup label="Maze Algorithms">
                <option value="prim">Prim's Algorithm</option>
              </optgroup>
            </select>
            <button
              onClick={resetGrid}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500"
              disabled={isRunning}>
              Shuffle Grid
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={speed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-32 disabled:opacity-50"
                disabled={isRunning}
              />
              <span className="text-sm text-gray-600">{speed}ms</span>
            </div>
          </div>
          <button
            onClick={isRunning ? stopAlgorithm : startAlgorithm}
            className={`rounded-lg px-4 py-2 text-white ${
              isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isRunning ? 'Stop' : 'Play'}
          </button>
        </div>
        <Grid />
        <Legend />
      </div>
    </div>
  );
}

export default App;
