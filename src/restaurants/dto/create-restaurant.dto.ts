import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ArrayMinSize, ArrayMaxSize, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({ type: 'array', items: { type: 'number' }, description: 'Longitude, Latitude' })
  @IsArray()
  @Type(() => Number)
  coordinates: number[];
}

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_en: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name_ar: string;

  @ApiProperty({ description: 'Unique slug for restaurant' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  cuisines: string[];

  @ApiProperty()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
