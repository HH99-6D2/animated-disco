import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '닉네임', maxLength: 20, minimum: 2 })
  @IsString()
  nickname: string;
}
