import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { ingredientList, recipeList, userList } from './__mocks__';
import { RecipeIngredient } from 'src/ingredient/recipe-ingredient.entity';

@Injectable()
export class DbSeedService implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepo: Repository<RecipeIngredient>
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'dev') {
      return;
    }
    await this.checkAndSeed();
  }

  async checkAndSeed() {
    const userCount = await this.userRepo.count();
    const recipeCount = await this.recipeRepo.count();
    const ingredientCount = await this.ingredientRepo.count();
    const recipeIngredientCount = await this.recipeIngredientRepo.count();

    if (
      userCount === 0 ||
      recipeCount === 0 ||
      ingredientCount === 0 ||
      (recipeCount > 0 && recipeIngredientCount === 0)
    ) {
      console.log('Resetting the db, seeding process has begun...');
      await this.dataSource.synchronize(true);
      await this.runSeed();
    } else {
      console.log('Database has entries, skipping the seed process.');
    }
  }

  async runSeed() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash('Password123!', salt);

      const users = this.userRepo.create(
        userList.map((user) => {
          return {
            ...user,
            password: hashedPassword,
          };
        })
      );
      const savedUsers = await queryRunner.manager.save(users);

      const ingredients = this.ingredientRepo.create(ingredientList);
      const savedIngredients = await queryRunner.manager.save(ingredients);

      for (const recipeData of recipeList) {
        const recipe = this.recipeRepo.create({
          ...recipeData,
          author: savedUsers[0],
        });

        const savedRecipe = await queryRunner.manager.save(recipe);

        for (const ing of recipeData.ingredients) {
          const dbIngredient = savedIngredients.find(
            (savedIngredient) => savedIngredient.name === ing.name
          );

          if (dbIngredient) {
            const recipeIng = this.recipeIngredientRepo.create({
              amount: ing.amount,
              recipe: savedRecipe,
              ingredient: dbIngredient,
            });
            await queryRunner.manager.save(recipeIng);
          }
        }
      }

      await queryRunner.commitTransaction();
      console.log('Seed process has been successfully completed.');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('Seed error:', err);
    } finally {
      await queryRunner.release();
    }
  }
}
