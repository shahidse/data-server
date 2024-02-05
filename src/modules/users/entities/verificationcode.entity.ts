import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VerificationCodeDocument = VerificationCode & Document;

@Schema({ timestamps: true })
export class VerificationCode extends Document {
  @Prop({ required: true, unique: true, type: String, index: true })
  email: string;
  @Prop()
  code: string;
}
export const verificationcodeSchema =
  SchemaFactory.createForClass(VerificationCode);
