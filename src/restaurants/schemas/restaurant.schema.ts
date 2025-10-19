import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name_en: string;

  @Prop({ required: true })
  name_ar: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ type: [String], required: true, validate: [(v: string[]) => v.length >=1 && v.length <= 3, 'Cuisines must be 1..3'] })
  cuisines: string[];

  // GeoJSON Point
  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0,0] },
  })
  location: { type: string; coordinates: number[] };
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Create 2dsphere index for geospatial queries
RestaurantSchema.index({ location: '2dsphere' });
RestaurantSchema.index({ slug: 1 }, { unique: true });
