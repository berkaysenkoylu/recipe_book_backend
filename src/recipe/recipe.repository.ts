import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipeRepository extends Repository<Recipe> {
  constructor(private dataSource: DataSource) {
    super(Recipe, dataSource.createEntityManager());
  }

  async getRecipes(): Promise<Recipe[]> {
    try {
      return this.manager.find(Recipe);
    } catch (error) {
      console.error('Error while fetching the data: ', error);
      throw error;
    }
  }
}
