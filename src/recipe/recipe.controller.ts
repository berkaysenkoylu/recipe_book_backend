import { Controller, Get } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import type { RecipeListResponseType } from './recipe.type';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/')
  getRecipes(): Promise<RecipeListResponseType> {
    return this.recipeService.getRecipes();
  }
}
