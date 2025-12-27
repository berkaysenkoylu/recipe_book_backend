import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Ingredient } from './ingredient.entity';
import { GetIngredientsFilterDto } from './dto/get-ingredients-filter.dto';

@Injectable()
export class IngredientRepository extends Repository<Ingredient> {
  constructor(private dataSource: DataSource) {
    super(Ingredient, dataSource.createEntityManager());
  }

  async getAllIngredients(
    filterDto: GetIngredientsFilterDto
  ): Promise<Ingredient[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('recipe');

    if (name) {
      query.andWhere('(LOWER(ingredient.name) LIKE LOWER(:name)');
    }

    try {
      return query.getMany();
    } catch (error) {
      console.error('Error while fetching the data: ', error);
      throw error;
    }
  }
}
