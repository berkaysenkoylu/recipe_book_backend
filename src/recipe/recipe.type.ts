interface BaseResponseType {
  message: string;
}

export interface RecipeListResponseType extends BaseResponseType {
  recipeList: any[];
}
