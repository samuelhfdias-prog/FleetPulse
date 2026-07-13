import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createDataSourceOptions } from './database.config';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UsersModule } from './modules/users/users.module';
import { MachinesModule } from './modules/machines/machines.module';
import { validateEnvironment } from './environment.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validate: validateEnvironment,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createDataSourceOptions({
          databasePath: config.getOrThrow<string>('DATABASE_PATH'),
          synchronize: config.getOrThrow<boolean>('DATABASE_SYNCHRONIZE'),
          logging: config.get<boolean>('DATABASE_LOGGING', false),
        }),
    }),
    AuthModule,
    CompaniesModule,
    UsersModule,
    MachinesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
