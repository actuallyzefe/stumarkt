import { IsMobilePhone, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  @IsMobilePhone('tr-TR')
  mobile: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
