import Grid from './components/Grid';
import { Header } from './components/Header';
import { Toaster } from './components/ui/toaster';
import { useToast } from './hooks/use-toast';
import { useWindowSize } from './hooks/useWindowSize';
import { useAlgorithmState, useAnimationConfig, useGridControls } from './store/useGridStore';

function App() {
  const { selectedAlgorithm, isRunning, algorithmState } = useAlgorithmState();
  const { resetGrid, startAlgorithm, stopAlgorithm, setSelectedAlgorithm, setAnimationSpeed } = useGridControls();
  const { speed } = useAnimationConfig();
  const { cellSize } = useWindowSize();
  const { toast } = useToast();

  const handleStartAlgorithm = async () => {
    const result = await startAlgorithm();
    if (result.success) {
      toast({
        title: 'Path Found!',
        description: `Found path in ${result.steps} steps, visited ${result.visitedNodes} nodes.`,
        duration: 3000,
      });
    } else if (result.steps > 0) {
      toast({
        title: 'No Path Found',
        description: `Visited ${result.visitedNodes} nodes but could not find a path to the target.`,
        duration: 3000,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100">
      <Header
        selectedAlgorithm={selectedAlgorithm}
        isRunning={isRunning}
        speed={speed}
        onAlgorithmChange={setSelectedAlgorithm}
        onSpeedChange={setAnimationSpeed}
        onReset={resetGrid}
        onPlayPause={isRunning ? stopAlgorithm : handleStartAlgorithm}
        canPlay={!isRunning && !algorithmState.lastStep?.path.length}
      />
      <main className="flex-1 min-h-0">
        <Grid cellSize={cellSize} />
      </main>
      <Toaster />
    </div>
  );
}

export default App;
