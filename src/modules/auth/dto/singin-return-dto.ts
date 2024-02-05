import { User, UserSchema } from 'src/modules/users/entities/user.entity';
import { Users } from 'src/modules/users/users.interface';

export class SignInReturnDto {
  readonly success: boolean;
  readonly access_token: string;
  readonly userData: any;
}
