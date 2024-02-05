import { Document } from 'mongoose';
export interface Users extends Document {
  readonly fullName: string;
  readonly email: number;
  readonly password: string;
  readonly isVerified: boolean;
}
