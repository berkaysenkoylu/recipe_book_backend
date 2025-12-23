import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';
import type { RecipeListResponseType, RecipeResponseType } from './recipe.type';

@Injectable()
export class RecipeService {
  constructor(private recipeRepository: RecipeRepository) {}

  async getRecipes(
    filterDto: GetRecipesFilterDto
  ): Promise<RecipeListResponseType> {
    const recipeList = await this.recipeRepository.getRecipes(filterDto);

    // TODO: This is to be replaced later.
    if (!recipeList) {
      throw new NotFoundException({
        isError: true,
        message: 'Something went wrong, no recipes have been fetched!',
      });
    }

    return {
      message: 'Recipe list has been successfully fetched!',
      recipeList,
    };
  }

  async getRecipeById(id: string): Promise<RecipeResponseType> {
    const fetchedRecipe = await this.recipeRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    if (!fetchedRecipe) {
      throw new NotFoundException('No such recipe was found!');
    }

    return {
      message: 'Recipe with the given id has been successfully fetched!',
      recipe: fetchedRecipe,
    };
  }
}
