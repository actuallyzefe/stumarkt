import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';
import { LoginInterface } from '../interfaces/login.interface';

export class LoginDTO implements LoginInterface {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('tr-TR')
  mobile: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
