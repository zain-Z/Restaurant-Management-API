import { Controller, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() dto: CreateUserDto) {
    return this.svc.create(dto);
  }

  @Post(':userId/follow/:restaurantId')
  @ApiOperation({ summary: 'User follow a restaurant' })
  async follow(@Param('userId') userId: string, @Param('restaurantId') restaurantId: string) {
    return this.svc.follow(userId, restaurantId);
  }
}
