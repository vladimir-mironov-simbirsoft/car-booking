import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Client, Pool } from 'pg';

const databasePoolFactory = async (configService: ConfigService): Promise<Pool> => {
  const config = {
    user: configService.get('DB_USER'),
    host: configService.get('DB_HOST'),
    database: configService.get('DB_NAME'),
    password: configService.get('DB_PASSWORD'),
    port: configService.get('DB_PORT'),
  };

  const pool = new Pool(config);

  return pool;
};

@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      inject: [ConfigService],
      useFactory: databasePoolFactory,
    },
  ],
  exports: ['DATABASE_POOL'],
})
export class DatabaseModule implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly moduleRef: ModuleRef) {}

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Shutting down on signal ${signal}`);
    const pool = this.moduleRef.get('DATABASE_POOL') as Pool;
    return pool.end();
  }
}
