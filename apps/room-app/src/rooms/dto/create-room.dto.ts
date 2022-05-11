import { IsNotEmpty } from 'class-validator';
import { Long } from 'typeorm';
import { Tag } from '../../entities/tag.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  positionX: number;

  @IsNotEmpty()
  positionY: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  categoryId: number;

  @IsNotEmpty()
  maxUser: number;

  @IsNotEmpty()
  imageUrl: string;

  @IsNotEmpty()
  regionAId: number;

  @IsNotEmpty()
  regionBId: number;

  @IsNotEmpty()
  tags: String[];
}
