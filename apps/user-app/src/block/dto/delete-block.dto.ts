import { PartialType } from '@nestjs/swagger';
import { CreateBlockDto } from './create-block.dto';

export class DeleteBlockDto extends PartialType(CreateBlockDto) {}
