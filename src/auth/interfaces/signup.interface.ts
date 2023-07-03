import { SchoolStatus } from 'src/users/enums/school-status.enum';
import { StudyArea } from 'src/users/enums/study-area.enum';

export interface SignupInterface {
  nameSurname: string;

  password: string;

  mobile: string;

  school?: string;

  schoolStatus: SchoolStatus;

  studyArea: StudyArea;
}
