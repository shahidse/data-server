import { IsString, MinLength } from 'class-validator';

export class verifyCodeDto {
  @IsString() @MinLength(6) readonly code: string;
  readonly newPassword: string;
  readonly email: string;
  readonly isEmailVerification: boolean;
}
