import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoleDocument = Roles & Document;

@Schema({ timestamps: true })
export class Roles extends Document {
  @Prop()
  role: string;
  @Prop({
    type: Types.ObjectId,
    ref: 'UserGroups',
  })
  ugId: Types.ObjectId;
}
export const RoleSchema = SchemaFactory.createForClass(Roles);
