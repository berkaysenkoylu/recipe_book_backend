import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  JWTPayloadType,
  LoginResponseType,
  SigninResponseType,
} from './auth.type';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class AuthRepository extends Repository<User> {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService
  ) {
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

  async loginUser(
    loginCredentialsDto: LoginCredentialsDto
  ): Promise<LoginResponseType> {
    const { email, password } = loginCredentialsDto;
    const user = await this.manager.findOne(User, {
      where: { email },
      select: { id: true, username: true, email: true, password: true },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { id, username, email } = user;
      const payload: JWTPayloadType = { id, username, email };
      const token = this.jwtService.sign(payload);

      return {
        message: 'User has successfully logged in!',
        userData: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        token,
      };
    } else {
      throw new UnauthorizedException(
        'Please check your authentication credentials!'
      );
    }
  }
}
