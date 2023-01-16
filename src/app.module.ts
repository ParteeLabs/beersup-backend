import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getDataSourceConfig } from './orm/type-orm.config';
import { RegistryProvider } from './providers/registry.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          ...getDataSourceConfig(new RegistryProvider()),
          migrations: ['./orm/migrations/*-Migration.ts'],
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
        };
      },
      dataSourceFactory: async (config) => new DataSource(config),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
