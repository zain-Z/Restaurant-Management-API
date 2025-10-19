import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({ isArray: true })
  @IsArray()
  favoriteCuisines: string[];
}
