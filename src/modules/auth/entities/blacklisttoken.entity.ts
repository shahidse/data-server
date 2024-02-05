import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as schema } from 'mongoose';

export type BlackListTokenDocument = BlackListToken & Document;
@Schema({ timestamps: true })
export class BlackListToken extends Document {
  @Prop({ type: schema.Types.ObjectId, ref: 'User', index: true })
  userId: schema.Types.ObjectId;

  @Prop()
  token: string;
}

export const BlackListTokenSchema =
  SchemaFactory.createForClass(BlackListToken);
