import { Recipe } from 'src/recipe/recipe.entity';
import { PrimaryGeneratedColumn, Column, Entity, OneToMany } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  profile_picture: string;

  @OneToMany(() => Recipe, (recipe) => recipe.author)
  my_recipes: Recipe[];
}
