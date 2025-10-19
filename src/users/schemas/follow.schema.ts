import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FollowDocument = Follow & Document;

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
FollowSchema.index({ user: 1, restaurant: 1 }, { unique: true });
