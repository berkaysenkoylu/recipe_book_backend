import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SigninResponseType } from './auth.type';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<SigninResponseType> {
    return await this.authRepository.createUser(authCredentialsDto);
  }

  async login(loginCredentialsDto: LoginCredentialsDto) {
    return await this.authRepository.loginUser(loginCredentialsDto);
  }
}
