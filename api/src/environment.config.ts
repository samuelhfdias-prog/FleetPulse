import { randomBytes } from 'node:crypto';

const developmentSecret = randomBytes(48).toString('hex');

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

export interface AppEnvironment {
  NODE_ENV: 'development' | 'test' | 'production';
  API_HOST: string;
  API_PORT: number;
  CORS_ORIGIN: string;
  DATABASE_PATH: string;
  DATABASE_SYNCHRONIZE: boolean;
  DATABASE_LOGGING: boolean;
  JWT_SECRET: string;
  JWT_EXPIRATION: number;
  ENABLE_DEMO_SEED: boolean;
  DEMO_ADMIN_PASSWORD: string;
  DEMO_USER_PASSWORD: string;
}

export function validateEnvironment(config: Record<string, unknown>): AppEnvironment {
  const nodeEnv = String(config['NODE_ENV'] ?? 'development') as AppEnvironment['NODE_ENV'];
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV deve ser development, test ou production.');
  }

  const apiPort = Number(config['API_PORT'] ?? 3000);
  const jwtExpiration = Number(config['JWT_EXPIRATION'] ?? 3600);
  const configuredSecret = String(config['JWT_SECRET'] ?? '');

  if (!Number.isInteger(apiPort) || apiPort < 1 || apiPort > 65535) {
    throw new Error('API_PORT deve ser uma porta válida entre 1 e 65535.');
  }
  if (!Number.isInteger(jwtExpiration) || jwtExpiration < 60) {
    throw new Error('JWT_EXPIRATION deve ser um número inteiro de ao menos 60 segundos.');
  }
  if (nodeEnv === 'production' && configuredSecret.length < 32) {
    throw new Error('JWT_SECRET deve possuir ao menos 32 caracteres em produção.');
  }

  return {
    NODE_ENV: nodeEnv,
    API_HOST: String(config['API_HOST'] ?? '0.0.0.0'),
    API_PORT: apiPort,
    CORS_ORIGIN: String(config['CORS_ORIGIN'] ?? 'http://localhost:4200'),
    DATABASE_PATH: String(config['DATABASE_PATH'] ?? 'data/momesso.sqlite'),
    DATABASE_SYNCHRONIZE: parseBoolean(
      config['DATABASE_SYNCHRONIZE'] as string | undefined,
      nodeEnv !== 'production',
    ),
    DATABASE_LOGGING: parseBoolean(config['DATABASE_LOGGING'] as string | undefined, false),
    JWT_SECRET: configuredSecret || developmentSecret,
    JWT_EXPIRATION: jwtExpiration,
    ENABLE_DEMO_SEED: parseBoolean(
      config['ENABLE_DEMO_SEED'] as string | undefined,
      nodeEnv === 'development',
    ),
    DEMO_ADMIN_PASSWORD: String(config['DEMO_ADMIN_PASSWORD'] ?? '123456'),
    DEMO_USER_PASSWORD: String(config['DEMO_USER_PASSWORD'] ?? '123456'),
  };
}
