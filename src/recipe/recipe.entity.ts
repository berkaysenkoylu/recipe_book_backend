import { User } from 'src/auth/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Index,
  ManyToOne,
} from 'typeorm';

interface Ingredient {
  name: string;
  amount: string;
}

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ fulltext: true })
  @Column({ type: 'jsonb' })
  ingredients: Ingredient[];

  @Column()
  preparation: string;

  @Column()
  prep_time_minutes: number;

  @ManyToOne(() => User, (user) => user.my_recipes)
  author: User;
}
