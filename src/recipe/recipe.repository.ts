import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';

@Injectable()
export class RecipeRepository extends Repository<Recipe> {
  constructor(private dataSource: DataSource) {
    super(Recipe, dataSource.createEntityManager());
  }

  async getRecipes(filterDto: GetRecipesFilterDto): Promise<Recipe[]> {
    const { search, ingredients } = filterDto;

    const query = this.createQueryBuilder('recipe');

    if (search) {
      query.andWhere(
        '(LOWER(recipe.name) LIKE LOWER(:search) OR LOWER(recipe.preparation) LIKE LOWER(:search))',
        { search: `%${search}%` }
      );
    }

    if (ingredients && ingredients.length > 0) {
      ingredients.forEach((ing, index) => {
        query.andWhere(
          `EXISTS (
          SELECT 1 
          FROM jsonb_array_elements(recipe.ingredients) AS elem 
          WHERE elem->>'name' ILIKE :ingName${index}
        )`,
          { [`ingName${index}`]: `%${ing}%` }
        );
      });
    }

    query.leftJoinAndSelect('recipe.author', 'user');

    try {
      return query.getMany();
    } catch (error) {
      console.error('Error while fetching the data: ', error);
      throw error;
    }
  }
}
