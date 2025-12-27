import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';

@Injectable()
export class RecipeRepository extends Repository<Recipe> {
  constructor(private dataSource: DataSource) {
    super(Recipe, dataSource.createEntityManager());
  }

  async getRecipes(filterDto: GetRecipesFilterDto) {
    const { search, ingredients } = filterDto;

    const query = this.createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.author', 'user')
      .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
      .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient');

    if (search) {
      query.andWhere(
        '(LOWER(recipe.name) LIKE LOWER(:search) OR LOWER(recipe.preparation) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (ingredients && ingredients.length > 0) {
      query.andWhere('ingredient.name IN (:...ingNames)', {
        ingNames: ingredients.map((i) => i.toLowerCase()),
      });
    }

    try {
      const fetchedRecipes = await query.getMany();

      const modifiedRecipes = fetchedRecipes.map((recipe) => {
        const {
          id,
          name,
          preparation,
          prep_time_minutes,
          author,
          recipeIngredients: recipeIngredients_,
        } = recipe;
        return {
          id,
          name,
          preparation,
          prep_time_minutes,
          author,
          ingredients: recipeIngredients_.map((ri) => {
            return {
              ...ri,
              name: ri.ingredient.name,
            };
          }),
        };
      });

      return modifiedRecipes;
    } catch (error) {
      console.error('Error while fetching the data: ', error);
      throw error;
    }
  }
}
