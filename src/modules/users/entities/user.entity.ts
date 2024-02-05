import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { FriendSchema } from 'src/modules/friends/entities/friend.entity';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true, type: String, index: true })
  email: string;

  @Prop({ required: true })
  password: string;
  @Prop({ required: true, unique: true, type: String, index: true })
  userName: string;
  @Prop({ required: true, unique: true, type: String, index: true })
  phoneNumber: string;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop({ default: '' })
  verificationToken: string;
  // @Prop({ type: [FriendSchema] })
  // friends: any;
  @Prop()
  age: string;
  @Prop({ default: null })
  image: string;
  @Prop({ default: null })
  cover: string;
  // @Prop({ default: '' })
  // passwordResetToken: string;
  // @Prop({ default: 0 })
  // passworResetAttempt: number;
  @Prop()
  role: string;

  // Add a pre-save middleware to hash the password
  async savePasswordHash(next: Function) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      const saltRounds = 10; // Adjust the number of salt rounds as needed
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  }
}
export const UserSchema = SchemaFactory.createForClass(User);

// Add a pre-save middleware to hash the password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const saltRounds = 10; // Adjust the number of salt rounds as needed
    const hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});
