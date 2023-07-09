import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { FollowLogicDTO } from './dtos/follow-logic.dto';
import { ReturnStatus } from 'src/types';
import { GetUserService } from 'src/utils/get-user.service';

@Injectable()
export class UsersService {
  constructor(private getUserService: GetUserService) {}

  async getMe(userId: number) {
    return this.getUserService.getUserById(userId);
  }

  async followUnFollowLogic(
    userId: number,
    postedNameSurname: FollowLogicDTO,
  ): Promise<ReturnStatus> {
    const { nameSurname } = postedNameSurname;
    const user = await this.getUserService.getUserById(userId);
    const otherUser = await this.getUserService.getUserByNameSurname(
      nameSurname,
    );

    if (user.nameSurname === nameSurname) {
      throw new BadRequestException('You cannot follow yourself');
    }
    try {
      if (!otherUser) {
        throw new NotFoundException();
      }

      if (!otherUser.followers?.includes(user.nameSurname)) {
        await user.updateOne({
          $push: { followings: nameSurname },
        });

        await otherUser.updateOne({
          $push: { followers: user.nameSurname },
        });
        const msg = `${otherUser.nameSurname} followed`;
        return { status: 'Success', msg };
      }

      await user.updateOne({
        $pull: {
          followings: otherUser.nameSurname,
        },
      });
      await otherUser.updateOne({
        $pull: {
          followers: user.nameSurname,
        },
      });

      const msg = `${otherUser.nameSurname} unfollowed`;
      return { status: 'Success', msg };
    } catch (e) {
      console.log(e);

      if (e instanceof NotFoundException) {
        throw new NotFoundException(e.message);
      } else if (e instanceof BadRequestException) {
        throw new BadRequestException(e.message);
      } else {
        throw new InternalServerErrorException(e.message);
      }
    }
  }
}
