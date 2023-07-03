import { LoginDTO } from '../dtos/login.dto';
import { SignupDTO } from '../dtos/signup.dto';
import { Tokens } from '../types';

export interface AuthInterface {
  signup(userCredentails: SignupDTO): Promise<Tokens>;

  login(userCredentials: LoginDTO): Promise<Tokens>;

  logout(userId: number): Promise<void>;

  updateRtHash(userId: number, rt: string): Promise<void>;

  getTokens(userId: number, mobile: string): Promise<Tokens>;

  refreshTokens(userId: number, rt: string): Promise<Tokens>;
}
