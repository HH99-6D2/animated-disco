import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'NickName of user which can be temporarily updated.',
    minimum: 2,
    maximum: 16,
    nullable: false,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(16)
  nickname?: string;

  @ApiProperty({
    description:
      'ImageUrl of user profile which can be updated by upload file or Link to image',
    maximum: 128,
    nullable: true,
  })
  @IsUrl()
  @MaxLength(128)
  imageUrl?: string;
}
