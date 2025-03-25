/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
 

import { environment } from './environmentService';

/** Signature of a logging function */
type LogFn = {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
type Logger = {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

const NO_OP: LogFn = (_?: any, ...__: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: (typeof environment)['VITE_CONFIG_LOG_LEVEL'] }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level === 'error') {
      this.warn = NO_OP;
      this.log = NO_OP;
      return;
    }

    this.warn = console.warn.bind(console);

    if (level === 'warn') {
      this.log = NO_OP;
      return;
    }

    this.log = console.log.bind(console);
  }
}

export const logger = new ConsoleLogger({ level: environment.VITE_CONFIG_LOG_LEVEL });
