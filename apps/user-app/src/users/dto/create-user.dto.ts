import {
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description:
      'An id from SocialProfile of a user which is already generated before create user.',
    nullable: false,
    readOnly: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'NickName of user which is imported from social information.',
    minimum: 2,
    maximum: 16,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  nickname: string;

  @ApiProperty({
    description:
      'ImageUrl of user profile which is imported from social information.',
    maximum: 128,
    nullable: true,
  })
  @IsUrl()
  @MaxLength(128)
  imageUrl?: string;
}
