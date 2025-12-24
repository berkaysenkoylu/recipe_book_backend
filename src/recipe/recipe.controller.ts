import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecipeService } from './recipe.service';
import type { RecipeListResponseType, RecipeResponseType } from './recipe.type';
import { GetRecipesFilterDto } from './dto/get-recipes-filter.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get('/')
  @UseGuards(AuthGuard())
  getRecipes(
    @Query() filterDto: GetRecipesFilterDto,
    @GetUser() user: User
  ): Promise<RecipeListResponseType> {
    return this.recipeService.getRecipes(filterDto, user);
  }

  @Get('/:id')
  getRecipeById(@Param('id') id: string): Promise<RecipeResponseType> {
    return this.recipeService.getRecipeById(id);
  }
}
