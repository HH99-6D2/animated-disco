import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'NickName of user which can be temporarily updated.',
    minLength: 2,
    maxLength: 24,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(24)
  nickname: string;
}
