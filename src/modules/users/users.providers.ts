import { Connection } from 'mongoose';
import { UserSchema } from './entities/user.entity';
import { verificationcodeSchema } from './entities/verificationcode.entity';
import { RootSchema } from './entities/root.entity';
import { UserGroupSchema } from './entities/ug.entity';
import { RoleSchema } from './entities/role.entity';

export const usersProviders = [
  {
    provide: 'USERS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'VERIFIVATIONCODE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('VerificationCode', verificationcodeSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ROOT_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Root', RootSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'USERGROUP_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('UserGroups', UserGroupSchema),
    inject: ['DATABASE_CONNECTION'],
  },
  {
    provide: 'ROLES_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Roles', RoleSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
