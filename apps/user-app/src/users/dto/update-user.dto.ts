import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class UpdateUserDto {
  @ApiProperty({
    description: 'NickName of user which can be temporarily updated.',
    minLength: 2,
    maxLength: 16,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  nickname: string;
}
