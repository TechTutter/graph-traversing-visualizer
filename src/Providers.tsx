import { ErrorBoundary } from '@lib/routes/ErrorBoundary';
import { FallbackComponent } from '@lib/routes/FallbackComponent';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>;
};
