import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Follow.name)
    private readonly followModel: Model<FollowDocument>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const created = await this.userModel.create(dto);
      return created;
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message || 'Failed to create user');
      }
      throw new BadRequestException('Failed to create user');
    }
  }

  async follow(userId: string, restaurantId: string) {
    try {
      const follow = await this.followModel.create({
        user: new Types.ObjectId(userId),
        restaurant: new Types.ObjectId(restaurantId),
      });
      return follow;
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message || 'Failed to follow');
      }
      throw new BadRequestException('Failed to follow');
    }
  }

  async getUser(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
