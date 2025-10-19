import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { Follow } from '../users/schemas/follow.schema';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class RecommendationsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
  ) {}

  /**
   * Recommendation logic:
   * Step 1 - Find other users who share the same Favorite cuisine as the user Id in the input.
   * Step 2 - Retrieve aggregated list of restaurants that are followed by those users.
   * Step 3 - Respond with the list of users from Step 1 and the list of restaurants from Step 2.
   *
   * Implementation uses a single aggregation pipeline on `users` and `follows`.
   */
  async recommendForUser(userId: string) {
    const userObjId = new Types.ObjectId(userId);

    // Ensure user exists and obtain favorite cuisines
    const user = await this.userModel.findById(userObjId).lean();
    if (!user) throw new NotFoundException('User not found');

    const favoriteCuisines = user.favoriteCuisines || [];

    // Pipeline:
    // 1) find users that share at least one favorite cuisine (excluding the target user)
    // 2) lookup follows to get restaurants followed by those users
    // 3) lookup restaurants details and group unique restaurants
    const pipeline = [
      { $match: { _id: { $ne: userObjId }, favoriteCuisines: { $in: favoriteCuisines } } },
      { $project: { fullName: 1, favoriteCuisines: 1 } },
      // lookup follows for each matched user
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'user',
          as: 'follows',
        },
      },
      // unwind follows to lookup restaurant details
      { $unwind: { path: '$follows', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'follows.restaurant',
          foreignField: '_id',
          as: 'follows.restaurantObj',
        },
      },
      { $unwind: { path: '$follows.restaurantObj', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$_id',
          fullName: { $first: '$fullName' },
          favoriteCuisines: { $first: '$favoriteCuisines' },
          restaurants: { $addToSet: '$follows.restaurantObj' },
        },
      },
      // Additionally, create a separate unique restaurants list across all users
      {
        $group: {
          _id: null,
          users: {
            $push: {
              _id: '$_id',
              fullName: '$fullName',
              favoriteCuisines: '$favoriteCuisines',
              restaurants: '$restaurants',
            },
          },
          restaurantsUnion: { $push: '$restaurants' },
        },
      },
      // flatten restaurantsUnion and unique by _id
      { $unwind: { path: '$restaurantsUnion', preserveNullAndEmptyArrays: true } },
      { $unwind: { path: '$restaurantsUnion', preserveNullAndEmptyArrays: true } },
      {
        $replaceRoot: {
          newRoot: {
            users: '$users',
            restaurant: '$restaurantsUnion',
          },
        },
      },
      {
        $group: {
          _id: null,
          users: { $first: '$users' },
          restaurants: { $addToSet: '$restaurant' },
        },
      },
      {
        $project: {
          _id: 0,
          users: 1,
          restaurants: 1,
        },
      },
    ];

    const agg = await this.userModel.aggregate(pipeline).allowDiskUse(true).exec();
    if (!agg || agg.length === 0) {
      return { users: [], restaurants: [] };
    }
    return agg[0];
  }
}
