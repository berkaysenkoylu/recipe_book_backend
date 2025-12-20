import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { RecipeRepository } from './recipe.repository';
import type { RecipeListResponseType } from './recipe.type';
import recipeList from 'src/__mocks__';

@Injectable()
export class RecipeService implements OnModuleInit {
  constructor(private recipeRepository: RecipeRepository) {}

  async onModuleInit() {
    const count = await this.recipeRepository.count();
    if (count === 0) {
      await this.seedRecipes();
    }
  }

  private async seedRecipes() {
    const dummyRecipes = [...recipeList];
    await this.recipeRepository.save(dummyRecipes);
    console.log('✅ Veritabanı başarıyla seedlendi!');
  }

  async getRecipes(): Promise<RecipeListResponseType> {
    const recipeList = await this.recipeRepository.getRecipes();

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
}
