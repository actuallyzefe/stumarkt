import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetCurrentUserId } from 'src/auth/common/decorators';
import { FollowLogicDTO } from './dtos/follow-logic.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@GetCurrentUserId() userId: number) {
    return this.usersService.getMe(userId);
  }

  @Patch('follow-unfollow')
  followUnFollowLogic(
    @GetCurrentUserId() userId: number,
    @Body() postedUser: FollowLogicDTO,
  ) {
    return this.usersService.followUnFollowLogic(userId, postedUser);
  }
}
