import { Types } from 'mongoose';
export class CreateUserDto {
  readonly fullName: string;
  readonly email: string;
  readonly password: string;
  readonly isVerified: boolean;
  readonly userName: string;
  readonly phoneNumber: string;
  // verificationToken: string;
  readonly age: string;
  role: Types.ObjectId;
}
