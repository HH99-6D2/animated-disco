import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'id of user account',
    nullable: false,
    uniqueItems: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'accessToken which is given by social provider.',
    nullable: false,
    uniqueItems: true,
  })
  @IsString()
  accessToken: string;
}
