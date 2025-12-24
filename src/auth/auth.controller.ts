import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { LoginResponseType, SigninResponseType } from './auth.type';
import { LoginCredentialsDto } from './dto/login-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto
  ): Promise<SigninResponseType> {
    return await this.authService.signUp(authCredentialsDto);
  }

  @Post('/login')
  async login(
    @Body() loginCredentialsDto: LoginCredentialsDto
  ): Promise<LoginResponseType> {
    return await this.authService.login(loginCredentialsDto);
  }
}
