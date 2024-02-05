import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> => {
      const mongoDbUri = configService.get<any>('db.uri');
      return await mongoose.connect(mongoDbUri);
    },
    inject: [ConfigService],
  },
];
