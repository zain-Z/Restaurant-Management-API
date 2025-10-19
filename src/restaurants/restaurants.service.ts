import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Model } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(dto: CreateRestaurantDto) {
    try {
      const created = await this.restaurantModel.create({
        name_en: dto.name_en,
        name_ar: dto.name_ar,
        slug: dto.slug,
        cuisines: dto.cuisines,
        location: {
          type: 'Point',
          coordinates: dto.location.coordinates,
        },
      });
      return created;
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message || 'Failed to create restaurant');
      }
      throw new BadRequestException('Failed to create restaurant');
    }
  }

  async list(filter?: { cuisine?: string }) {
    const query: Record<string, any> = {};

    if (filter?.cuisine) {
      query.cuisines = filter.cuisine;
    }

    return this.restaurantModel.find(query).lean();
  }

  async findById(id: string) {
    const restaurant = await this.restaurantModel.findById(id).lean();
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async findBySlug(slug: string) {
    const restaurant = await this.restaurantModel.findOne({ slug }).lean();
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }

  async nearby(lng: number, lat: number, radiusMeters = 1000) {
    try {
      return await this.restaurantModel
        .find({
          location: {
            $nearSphere: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              $maxDistance: radiusMeters,
            },
          },
        })
        .lean();
    } catch (err) {
      if (err instanceof Error) {
        throw new BadRequestException(err.message || 'Failed to fetch nearby restaurants');
      }
      throw new BadRequestException('Failed to fetch nearby restaurants');
    }
  }
}
