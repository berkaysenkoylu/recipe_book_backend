import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SigninResponseType } from './auth.type';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<SigninResponseType> {
    return await this.authRepository.createUser(authCredentialsDto);
  }
}
