import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SigninResponseType } from './auth.type';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<SigninResponseType> {
    const { email, username, password } = authCredentialsDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = this.manager.create(User, {
      email,
      username,
      password: hashedPassword,
    });
    try {
      const result = await this.save(user);

      return {
        message: 'Signup has been successful!',
        user: {
          username: result.username,
          email: result.email,
        },
      };
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        throw new ConflictException('Username or Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
