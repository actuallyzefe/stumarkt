import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { SchoolStatus } from 'src/users/enums/school-status.enum';
import { StudyArea } from 'src/users/enums/study-area.enum';

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

  @Prop({ required: false, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  followers: string[];

  @Prop({ required: false, ref: 'User', type: mongoose.Schema.Types.ObjectId })
  followings: string[];

  @Prop({ required: false, type: String, default: '' })
  bio: string;

  @Prop({
    required: false,
    ref: 'Product',
    type: mongoose.Types.ObjectId,
  })
  listings: mongoose.Types.ObjectId[];

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

  @Prop({ required: false, type: String, select: false })
  hashedRt: string;

  @Prop({ type: String, unique: true })
  accountNumber: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
