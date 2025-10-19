import { Controller, Get, Param } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(private svc: RecommendationsService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get restaurant recommendations for a user' })
  async recommend(@Param('userId') userId: string) {
    return this.svc.recommendForUser(userId);
  }
}
