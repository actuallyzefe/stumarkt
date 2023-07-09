import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.model';

@Injectable()
export class GetUserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async getUserById(userId: number) {
    return this.userModel.findById(userId);
  }

  async getUserByAccountNumber(accountNumber: string) {
    return this.userModel.findOne({ accountNumber });
  }

  async getUserByNameSurname(nameSurname: string) {
    return this.userModel.findOne({ nameSurname });
  }
}
