import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('api/signup')
  signup() {
    this.authService.signup();
  }

  @Post('api/login')
  login() {
    this.authService.login();
  }

  @Post('api/logout')
  logout() {
    this.authService.logout();
  }

  @Post('refresh')
  refreshTokens() {
    this.authService.refreshTokens();
  }
}
