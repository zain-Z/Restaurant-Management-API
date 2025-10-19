import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  fullName: string;

  // favorite cuisines as array of strings
  @Prop({ type: [String], default: [] })
  favoriteCuisines: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
