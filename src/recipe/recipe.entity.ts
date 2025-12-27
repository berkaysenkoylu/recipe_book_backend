import { User } from 'src/auth/user.entity';
import { RecipeIngredient } from 'src/ingredient/recipe-ingredient.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  preparation: string;

  @Column()
  prep_time_minutes: number;

  @ManyToOne(() => User, (user) => user.my_recipes)
  author: User;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe)
  recipeIngredients: RecipeIngredient[];
}
