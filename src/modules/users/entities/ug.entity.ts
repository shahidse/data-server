import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserGroupDocument = UserGroup & Document;

@Schema({ timestamps: true })
export class UserGroup extends Document {
  @Prop()
  userGroup: string;
  @Prop({
    type: Types.ObjectId,
    ref: 'Root',
  })
  rootId: Types.ObjectId;
}
export const UserGroupSchema = SchemaFactory.createForClass(UserGroup);
