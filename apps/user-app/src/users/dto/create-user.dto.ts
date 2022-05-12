import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'NickName of user which is imported from social information.',
    minLength: 2,
    maxLength: 16,
    nullable: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  nickname: string;

  @ApiProperty({
    description:
      'An id from SocialProfile of a user which is already generated before create user.',
    nullable: false,
    uniqueItems: true,
    required: true,
  })
  @IsNumber()
  id: number;
}
