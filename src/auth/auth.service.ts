import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/user.model';
import { SignupDTO } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types';
import { LoginDTO } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { GenerateNumberService } from 'src/utils/generate-number.service';
import { AuthInterface } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements AuthInterface {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private generateNumberService: GenerateNumberService,
  ) {}

  async signup(userCredentials: SignupDTO): Promise<Tokens> {
    const { mobile, password } = userCredentials;

    const duplicatedMobile = await this.userModel.findOne({ mobile });

    if (duplicatedMobile)
      throw new BadRequestException('This phone number already taken');
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      userCredentials.password = hashedPassword;
      const accountNumber = await this.generateNumberService.validNumber(10);

      const newUser = await this.userModel.create(userCredentials);
      newUser.accountNumber = accountNumber;
      await newUser.save();

      const tokens = await this.getTokens(newUser.id, newUser.mobile);
      await this.updateRtHash(newUser.id, tokens.refresh_token);

      return tokens;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }

  async login(userCredentials: LoginDTO): Promise<Tokens> {
    const { mobile, password } = userCredentials;

    const user = await this.userModel.findOne({ mobile }).select('+password');
    if (!user) throw new NotFoundException();
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) throw new ForbiddenException('Invalid Password');

      const tokens = await this.getTokens(user.id, user.mobile);
      await this.updateRtHash(user.id, tokens.refresh_token);

      return tokens;
    } catch (e) {
      console.log(e);
      return e.message;
    }
  }

  async logout(userId: number): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      { _id: userId },
      { $unset: { hashedRt: null } },
    );
  }

  // UTILITES
  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { hashedRt: hash },
    });
  }
  async getTokens(userId: number, mobile: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          mobile,
        },
        {
          secret: this.configService.get<string>('AT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          mobile,
        },
        {
          secret: this.configService.get<string>('RT_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.hashedRt) throw new ForbiddenException();

    const rtMatch = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatch) throw new ForbiddenException();

    const tokens = await this.getTokens(user.id, user.mobile);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
