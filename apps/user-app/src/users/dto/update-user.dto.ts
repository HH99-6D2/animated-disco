import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'NickName of user which is temporary.',
    minimum: 2,
    maximum: 20,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  nickname: string;
}
