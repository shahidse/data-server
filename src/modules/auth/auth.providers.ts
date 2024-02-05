import { Connection } from 'mongoose';
import { BlackListTokenSchema } from './entities/blacklisttoken.entity';

export const authProviders = [
  {
    provide: 'BLACKLISTTOKEN_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Blacklisttoken', BlackListTokenSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
