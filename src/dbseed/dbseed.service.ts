import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';
import { recipeList, userList } from './__mocks__';

@Injectable()
export class DbSeedService implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'dev') {
      return;
    }
    await this.checkAndSeed();
  }

  async checkAndSeed() {
    const userCount = await this.userRepo.count();

    if (userCount === 0) {
      console.log('Database is empty, seed process has begun...');
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

      const recipes = this.recipeRepo.create(
        recipeList.map((recipe) => {
          return {
            ...recipe,
            author: savedUsers[0],
          };
        })
      );
      await queryRunner.manager.save(recipes);

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
