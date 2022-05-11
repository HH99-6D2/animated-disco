import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { LoginAuthDto } from '../../auth/dto/login-auth.dto';

export class UpdateUserDto extends LoginAuthDto {
  @ApiProperty({
    description: 'NickName of user which can be temporarily updated.',
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
      'ImageUrl of user profile which can be updated by upload file or Link to image',
    minLength: 10,
    maxLength: 128,
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(128)
  imageUrl: string;
}
