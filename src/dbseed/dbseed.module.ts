import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbSeedService } from './dbseed.service';
import { User } from 'src/auth/user.entity';
import { Recipe } from 'src/recipe/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User])],
  providers: [DbSeedService],
})
export class DbSeedModule {}
