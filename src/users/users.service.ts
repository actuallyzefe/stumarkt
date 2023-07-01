import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Request,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  uploadFile() {}

  // NEED REFACTORING // follow and unfollow methods kinda similar. We can refactor them later
  async followUser(req: any, postedNameSurname: string) {
    const currentUser = req.user;

    if (currentUser.nameSurname === postedNameSurname) {
      throw new BadRequestException('You cannot follow yourself');
    } else {
      try {
        const user = await this.userModel.findOne({
          nameSurname: currentUser.nameSurname,
        });
        const otherUser = await this.userModel.findOne({
          nameSurname: postedNameSurname,
        });

        if (!otherUser) {
          throw new NotFoundException();
        }

        if (!otherUser.followers.includes(currentUser.nameSurname)) {
          await user.updateOne({
            $push: { followings: postedNameSurname },
          });

          await otherUser.updateOne({
            $push: { followers: currentUser.nameSurname },
          });
          return `${otherUser.nameSurname} followed`;
        } else {
          throw new BadRequestException('You are already following this user');
        }
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

  // NEED REFACTORING // follow and unfollow methods kinda similar. We can refactor them later
  async unfollowUser(@Request() req: any, postedNameSurname: string) {
    const currentUser = req.user;

    if (currentUser.nameSurname === postedNameSurname) {
      throw new BadRequestException('You cannot unfollow yourself');
    } else {
      try {
        const user = await this.userModel.findOne({
          nameSurname: currentUser.nameSurname,
        });
        const otherUser = await this.userModel.findOne({
          nameSurname: postedNameSurname,
        });

        if (!otherUser) {
          throw new NotFoundException();
        }

        if (otherUser.followers.includes(currentUser.nameSurname)) {
          await user.updateOne({
            $pull: { followings: postedNameSurname },
          });

          await otherUser.updateOne({
            $pull: { followers: currentUser.nameSurname },
          });
          return `${otherUser.nameSurname} unfollowed`;
        } else {
          throw new BadRequestException('You can not unfollow this user');
        }
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
}
// commit
