import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

import { RegistryProvider } from '../providers/registry.provider';

const registry = new RegistryProvider();

export function getDataSourceConfig(registry: RegistryProvider) {
  const engine = registry.getConfig().DB_ENGINE;
  switch (engine) {
    case 'sqlite':
      return {
        type: 'sqlite' as any,
        database: registry.getConfig().DB_URL,
      };

    default:
      return {
        type: engine,
        url: registry.getConfig().DB_URL,
      };
  }
}

/**
 * For migration files generator
 */
export default new DataSource({
  ...getDataSourceConfig(registry),
  entities: ['./src/orm/model/*.model.ts'],
  migrations: ['./src/orm/migrations/*-Migration.ts'],
} as DataSourceOptions);
