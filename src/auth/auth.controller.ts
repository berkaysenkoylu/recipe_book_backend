import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { SigninResponseType } from './auth.type';

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
  login() {}
}
