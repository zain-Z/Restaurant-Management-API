import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { UsersModule } from './users/users.module';
import { RecommendationsModule } from './recommendations/recommendations.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db'),
    RestaurantsModule,
    UsersModule,
    RecommendationsModule,
  ],
})
export class AppModule {}
