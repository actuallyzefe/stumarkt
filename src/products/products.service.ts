import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/users/user.model';
import { Product } from './product.model';
import { ProductDTO } from './dtos/product.dto';

import { generateNumber } from 'src/utils/generate-number';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private awsService: AwsService,
  ) {}

  async uploadProduct(
    file: Express.Multer.File,
    userId: number,
    productDetails: ProductDTO,
  ) {
    const { title, price, description, productStatus, type, tags } =
      productDetails;
    const user = await this.userModel.findById(userId);
    const key = `${file.fieldname}${Date.now()}`;
    const productNo = generateNumber(7);
    const parentFolder = 'products';

    try {
      await this.awsService.uploadFile(file, key, parentFolder, productNo);

      const product = await this.productModel.create({
        tags,
        title,
        price,
        description,
        productStatus,
        type,
        imageUrl: key,
        uploadedBy: user._id,
        productNo,
      });

      await product.save();

      return { status: 'Success', msg: 'Product uploaded' };
    } catch (e) {
      const msg = e.message;
      console.log(e);
      return { msg };
    }
  }

  async findProducts() {
    return this.productModel.find().populate('uploadedBy', 'nameSurname');
  }
}
