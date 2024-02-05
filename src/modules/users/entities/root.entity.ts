import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RootDocument = Root & Document;

@Schema({ timestamps: true })
export class Root extends Document {
  @Prop()
  root: string;
  @Prop()
  role: string;
}
export const RootSchema = SchemaFactory.createForClass(Root);
