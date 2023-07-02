import { IsNotEmpty, IsString } from 'class-validator';

export class FollowLogicDTO {
  @IsNotEmpty()
  @IsString()
  nameSurname: string;
}
