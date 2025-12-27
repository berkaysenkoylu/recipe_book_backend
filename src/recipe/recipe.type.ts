import { User } from 'src/auth/user.entity';
import { BaseResponseType } from 'src/types';

interface IngredientType {
  id: number;
  name: string;
  amount: string;
}

export interface RecipeType {
  id: string;
  name: string;
  preparation: string;
  prep_time_minutes: number;
  author: User;
  ingredients: IngredientType[];
}

export interface RecipeListResponseType extends BaseResponseType {
  recipeList: RecipeType[];
}

export interface RecipeResponseType extends BaseResponseType {
  recipe: RecipeType;
}
