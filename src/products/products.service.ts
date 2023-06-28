import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/users/user.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private awsService: AwsService,
  ) {}

  async uploadProductImages(
    file: Express.Multer.File,
    userId: number,
    parent_folder: string,
  ) {
    const key = `${file.fieldname}${Date.now()}`;
    const user = await this.userModel.findById(userId);
    const account_number = user.accountNumber;
    try {
      return this.awsService.uploadFile(
        file,
        key,
        parent_folder,
        account_number,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
