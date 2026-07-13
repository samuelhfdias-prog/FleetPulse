import { mkdirSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Company } from './modules/companies/company.entity';
import { Machine } from './modules/machines/machine.entity';
import { User } from './modules/users/user.entity';

const apiRoot = resolve(__dirname, '..');

export function createDataSourceOptions(
  config: {
    databasePath?: string;
    synchronize?: boolean;
    logging?: boolean;
  } = {},
): DataSourceOptions {
  const configuredPath = config.databasePath || 'data/momesso.sqlite';
  const databasePath = isAbsolute(configuredPath)
    ? configuredPath
    : resolve(apiRoot, configuredPath);

  mkdirSync(dirname(databasePath), { recursive: true });

  return {
    type: 'sqlite',
    database: databasePath,
    entities: [Company, Machine, User],
    migrations: [resolve(apiRoot, 'dist/migrations/*.js')],
    synchronize: config.synchronize ?? true,
    logging: config.logging ?? false,
  };
}

export const dataSourceOptions = createDataSourceOptions({
  databasePath: process.env.DATABASE_PATH,
  synchronize: process.env.DATABASE_SYNCHRONIZE !== 'false',
  logging: process.env.DATABASE_LOGGING === 'true',
});

export const AppDataSource = new DataSource(dataSourceOptions);
