import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() userCredentials: SignupDTO) {
    return this.authService.signup(userCredentials);
  }

  @Post('login')
  login() {
    return this.authService.login();
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    return this.authService.refreshTokens();
  }
}
