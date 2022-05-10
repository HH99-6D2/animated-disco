import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    description: 'Provider of social account',
    nullable: false,
  })
  provider: number;

  @ApiProperty({
    description: 'socialId of user which is imported from social information.',
    nullable: false,
  })
  socialId: string;

  @ApiProperty({
    description: 'email of user which is imported from social information.',
    nullable: true,
  })
  @IsEmail()
  email?: string;
}
