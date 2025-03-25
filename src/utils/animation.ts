export function createThrottledAnimationFrame(delay: number) {
  let rafId: number | null = null;
  let lastTime = 0;

  const request = (callback: () => void): Promise<void> => {
    return new Promise((resolve) => {
      const animate = (timestamp: number) => {
        if (timestamp - lastTime >= delay) {
          lastTime = timestamp;
          callback();
          resolve();
        } else {
          rafId = requestAnimationFrame(animate);
        }
      };

      rafId = requestAnimationFrame(animate);
    });
  };

  const cancel = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return {
    request,
    cancel,
  };
} 