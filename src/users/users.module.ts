import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { UsersController } from './users.controller';
import { GetUserService } from 'src/utils/get-user.service';

@Module({
  providers: [UsersService, GetUserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
})
export class UsersModule {}
