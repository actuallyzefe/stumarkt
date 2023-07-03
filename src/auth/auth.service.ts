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

@Injectable()
export class AuthService {
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    userCredentials.password = hashedPassword;
    const accountNumber = await this.generateNumberService.validNumber(10);

    const newUser = await this.userModel.create(userCredentials);
    newUser.accountNumber = accountNumber;
    newUser.save();

    const tokens = await this.getTokens(newUser.id, newUser.mobile);
    await this.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }

  async login(userCredentials: LoginDTO): Promise<Tokens> {
    const { mobile, password } = userCredentials;

    const user = await this.userModel.findOne({ mobile }).select('+password');
    if (!user) throw new NotFoundException();

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new ForbiddenException('Invalid Password');

    const tokens = await this.getTokens(user.id, user.mobile);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number) {
    await this.userModel.updateMany(
      { _id: userId },
      { $set: { hashedRt: null } },
    );
  }

  // UTILITES
  async updateRtHash(userId: number, rt: string) {
    const hash = await bcrypt.hash(rt, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { hashedRt: hash },
    });
  }
  async getTokens(userId: number, mobile: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
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
      access_token: at,
      refresh_token: rt,
    };
  }

  async refreshTokens(userId: number, rt: string) {
    const user = await this.userModel.findById(userId);
    if (!user || !user.hashedRt) throw new ForbiddenException();

    const rtMatch = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatch) throw new ForbiddenException();

    const tokens = await this.getTokens(user.id, user.mobile);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
