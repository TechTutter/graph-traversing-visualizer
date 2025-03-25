/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

type EnvironmentType = 'dev' | 'prod';
type LogLevel = 'log' | 'warn' | 'error';

/**
 * This should always match the .env files.
 */
interface ImportMetaEnv {
  // App
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;

  // Env
  readonly VITE_ENV: EnvironmentType;

  // Config
  readonly VITE_CONFIG_API_URL: string;
  readonly VITE_CONFIG_LOG_LEVEL: LogLevel;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
