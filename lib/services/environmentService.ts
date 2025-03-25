const env = import.meta.env;
type Environment = typeof env;

export const environment: Environment = {
  // Defaults
  BASE_URL: env.BASE_URL,
  DEV: env.DEV,
  MODE: env.MODE,
  PROD: env.PROD,
  SSR: env.SSR,

  // App
  VITE_APP_NAME: env.VITE_APP_NAME,
  VITE_APP_VERSION: env.VITE_APP_VERSION,

  // Environment
  VITE_ENV: env.VITE_ENV,

  // Api
  VITE_CONFIG_API_URL: env.VITE_CONFIG_API_URL,
  VITE_CONFIG_LOG_LEVEL: env.VITE_CONFIG_LOG_LEVEL,
};
