import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategory(): Promise<Category[]> {
    return this.categoriesService.getAllCategory();
  }
}