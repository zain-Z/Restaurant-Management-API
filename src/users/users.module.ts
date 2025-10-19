import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Follow, FollowSchema } from './schemas/follow.schema';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    MongooseModule.forFeature([{ name: Restaurant.name, schema: RestaurantSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
