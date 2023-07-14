import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDTO } from './dtos/signup.dto';
import { LoginDTO } from './dtos/login.dto';
import { Tokens } from './types';

import { RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from './common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() userCredentials: SignupDTO): Promise<Tokens> {
    return this.authService.signup(userCredentials);
  }

  @Public()
  @Post('login')
  login(@Body() userCredentials: LoginDTO): Promise<Tokens> {
    return this.authService.login(userCredentials);
  }

  @Post('logout')
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshToken(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
