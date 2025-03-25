import Grid from './components/Grid';
import { Header } from './components/Header';
import { useWindowSize } from './hooks/useWindowSize';
import { useAlgorithmState, useAnimationConfig, useGridControls } from './store/useGridStore';

function App() {
  const { selectedAlgorithm, isRunning } = useAlgorithmState();
  const { resetGrid, startAlgorithm, stopAlgorithm, setSelectedAlgorithm, setAnimationSpeed } = useGridControls();
  const { speed } = useAnimationConfig();
  const { cellSize } = useWindowSize();

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">
      <Header
        selectedAlgorithm={selectedAlgorithm}
        isRunning={isRunning}
        speed={speed}
        onAlgorithmChange={setSelectedAlgorithm}
        onSpeedChange={setAnimationSpeed}
        onReset={resetGrid}
        onPlayPause={isRunning ? stopAlgorithm : startAlgorithm}
      />
      <main className="h-[calc(100vh-64px)]">
        <Grid cellSize={cellSize} />
      </main>
    </div>
  );
}

export default App;
