import { Injectable } from '@nestjs/common';
import { IngredientRepository } from './ingredient.repository';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';
import { Ingredient } from './ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(private ingredientRepository: IngredientRepository) {}

  async getIngredients(
    filterDto: GetIngredientsFilterDto
  ): Promise<Ingredient[]> {
    return await this.ingredientRepository.getAllIngredients(filterDto);
  }
}
