import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty({
    description: 'Refresh Token to create Access Token',
  })
  @IsString()
  refreshToken: string;
}
