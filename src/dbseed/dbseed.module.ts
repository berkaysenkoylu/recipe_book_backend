import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbSeedService } from './dbseed.service';
import { User } from 'src/auth/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { RecipeIngredient } from 'src/ingredient/recipe-ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ingredient, Recipe, RecipeIngredient, User]),
  ],
  providers: [DbSeedService],
})
export class DbSeedModule {}
