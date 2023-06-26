import { IsString } from 'class-validator';
import { SchoolStatus } from '../enums/school-status.enum';

export class SignupDTO {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  school: string;

  @IsString()
  schoolStatus: SchoolStatus;
}
