import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateTokenDto {
  @ApiProperty({
    description:
      'Refresh Token which is used for refresh. Valid for this Only this because of its life-time existability',
    nullable: true,
  })
  @IsString()
  refreshToken: string;
}
