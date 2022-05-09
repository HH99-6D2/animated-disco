import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description:
      'An id from SocialProfile of a user which is already generated before create user.',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'NickName of user which is temporary.',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}
