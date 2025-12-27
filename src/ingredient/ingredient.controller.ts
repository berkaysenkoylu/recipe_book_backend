import { Controller, Get, Query } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { Ingredient } from './ingredient.entity';

@Controller('ingredients')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  getAllIngredients(
    @Query() filterDto: GetIngredientsFilterDto
  ): Promise<Ingredient[]> {
    return this.ingredientService.getIngredients(filterDto);
  }
}
