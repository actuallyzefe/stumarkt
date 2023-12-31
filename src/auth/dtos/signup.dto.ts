import {
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SchoolStatus } from '../../users/enums/school-status.enum';
import { StudyArea } from '../../users/enums/study-area.enum';

export class SignupDTO {
  @IsString()
  @IsNotEmpty()
  nameSurname: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsMobilePhone('tr-TR')
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsOptional()
  school?: string;

  @IsString()
  @IsNotEmpty()
  schoolStatus: SchoolStatus;

  @IsString()
  @IsNotEmpty()
  studyArea: StudyArea;
}
//
