import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.model';
import { SignupDTO } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signup(userCredentials: SignupDTO) {
    const { mobile, password } = userCredentials;
    const duplicatedMobile = await this.userModel.findOne({ mobile });
    if (duplicatedMobile)
      throw new BadRequestException('This phone number already taken');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userCredentials.password = hashedPassword;

    await this.userModel.create(userCredentials);
    return { status: 'Success' };
  }
  login() {}
  logout() {}
  refreshTokens() {}
}
