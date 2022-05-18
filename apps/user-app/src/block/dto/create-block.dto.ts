import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockDto {
  @ApiProperty({
    description: 'An id of user to block',
    nullable: false,
    uniqueItems: true,
    required: true,
  })
  @IsNumber()
  blockUser: number;

  @ApiProperty({
    description: 'An id of user',
    nullable: false,
    uniqueItems: true,
    required: true,
  })
  @IsOptional()
  @IsNumber()
  user: number;
}
