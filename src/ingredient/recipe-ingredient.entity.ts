import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';
import { Ingredient } from './ingredient.entity';

@Entity('RecipeIngredient')
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE',
  })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
  ingredient: Ingredient;
}
