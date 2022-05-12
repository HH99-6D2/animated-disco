import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialTokenDto {
  @ApiProperty({
    description: 'Social Token to logout of signout',
  })
  @IsString()
  accessToken: string;
}
