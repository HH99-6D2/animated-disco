import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'socialprofile' })
export class CreateAuthDto {
  @ApiProperty({
    description: 'Provider of social account',
    minLength: 2,
    maxLength: 10,
    nullable: false,
  })
  provider: string;

  @ApiProperty({
    description: 'socialId of user which is imported from social information.',
    minimum: 2,
    maximum: 16,
    nullable: false,
  })
  socialId: number;

  @ApiProperty({
    description: 'email of user which is imported from social information.',
    nullable: true,
  })
  @IsEmail()
  email?: string;
}
