import { Controller, Get, Param, Query } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import type { RecipeListResponseType, RecipeResponseType } from './recipe.type';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/')
  getRecipes(
    @Query() filterDto: GetRecipesFilterDto
  ): Promise<RecipeListResponseType> {
    return this.recipeService.getRecipes(filterDto);
  }

  @Get('/:id')
  getRecipeById(@Param('id') id: string): Promise<RecipeResponseType> {
    return this.recipeService.getRecipeById(id);
  }
}
