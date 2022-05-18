import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({
    description: 'content of report message',
    minLength: 1,
    maxLength: 128,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  content: string;

  @ApiProperty({
    description: 'An id of user to report',
    nullable: false,
    uniqueItems: true,
    required: true,
  })
  @IsNumber()
  reportUser: number;

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
