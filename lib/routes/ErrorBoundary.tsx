import { logger } from '@lib/services/loggerService';
import type { ComponentType, ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';

type FallbackProps = {
  error: Error | null;
};

type Props = {
  children?: ReactNode;
  FallbackComponent: ComponentType<FallbackProps>;
};

type State = {
  hasError: boolean;
  error: null | Error;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error(error, errorInfo);
  }

  /**
   * Render the standard content, or the fallback page if an error occurs
   */
  public render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;
      return <FallbackComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}
