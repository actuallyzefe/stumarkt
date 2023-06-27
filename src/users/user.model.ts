import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SchoolStatus } from 'src/auth/enums/school-status.enum';
import { StudyArea } from 'src/auth/enums/study-area.enum';

@Schema({
  timestamps: true,
})
export class User {
  @Prop({ required: true, type: String })
  nameSurname: string;

  @Prop({ required: true, type: String, select: false })
  password: string;

  @Prop({ required: true, type: String, unique: true })
  mobile: string;

  @Prop({ required: false, type: String })
  school: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(SchoolStatus),
  })
  schoolStatus: SchoolStatus;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(StudyArea),
  })
  studyArea: StudyArea;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
