import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { JWTPayloadType } from './auth.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager,
    private configService: ConfigService
  ) {
    super({
      secretOrKey:
        configService.get<string>('JWT_SECRET') || process.env.JWT_SECRET!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWTPayloadType): Promise<User> {
    const { id, email, username } = payload;
    const user: User = (await this.entityManager.findOne(User, {
      where: {
        id,
        username,
        email,
      },
    })) as User;

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
