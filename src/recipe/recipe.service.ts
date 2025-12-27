import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';
import type { RecipeListResponseType, RecipeResponseType } from './recipe.type';
import { User } from 'src/auth/user.entity';

@Injectable()
export class RecipeService {
  constructor(private recipeRepository: RecipeRepository) {}

  async getRecipes(
    filterDto: GetRecipesFilterDto,
    user: User
  ): Promise<RecipeListResponseType> {
    const recipeList = await this.recipeRepository.getRecipes(filterDto);

    console.log(user);

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
      relations: [
        'author',
        'recipeIngredients.ingredient',
        'recipeIngredients',
      ],
    });

    if (!fetchedRecipe) {
      throw new NotFoundException('No such recipe was found!');
    }

    const {
      id: ID,
      name,
      preparation,
      prep_time_minutes,
      author,
      recipeIngredients,
    } = fetchedRecipe;

    const modifiedRecipe = {
      id: ID,
      name,
      preparation,
      prep_time_minutes,
      author,
      ingredients: recipeIngredients.map((ri) => {
        return {
          id: ri.id,
          name: ri.ingredient.name,
          amount: ri.amount,
        };
      }),
    };

    return {
      message: 'Recipe with the given id has been successfully fetched!',
      recipe: modifiedRecipe,
    };
  }
}
