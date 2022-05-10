import { ApiProperty } from '@nestjs/swagger';

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
}
