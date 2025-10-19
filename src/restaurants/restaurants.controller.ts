import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly svc: RestaurantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create restaurant' })
  async create(@Body() dto: CreateRestaurantDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List restaurants' })
  async list(@Query('cuisine') cuisine?: string) {
    return this.svc.list({ cuisine });
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get restaurant by id' })
  async getById(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get restaurant by slug' })
  async getBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Find nearby restaurants by lng & lat (meters within 1000 by default)' })
  async nearby(@Query('lng') lngStr: string, @Query('lat') latStr: string, @Query('radius') radius?: string) {
    const lng = parseFloat(lngStr as string);
    const lat = parseFloat(latStr as string);
    const r = radius ? parseInt(radius, 10) : 1000;
    return this.svc.nearby(lng, lat, r);
  }
}
