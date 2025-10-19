import { Module } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Follow, FollowSchema } from '../users/schemas/follow.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]),
  ],
  providers: [RecommendationsService],
  controllers: [RecommendationsController],
})
export class RecommendationsModule {}
