import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
// import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  // imports: [ConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
