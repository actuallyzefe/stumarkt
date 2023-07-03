import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AwsService } from 'src/aws/aws.service';
import { User } from 'src/users/user.model';
import { Product } from './product.model';
import { ProductDTO } from './dtos/product.dto';
import { generateNumber } from 'src/utils/generate-number';
import { ReturnStatus } from './types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private awsService: AwsService,
  ) {}

  async uploadProduct(
    files: Express.Multer.File[],
    userId: number,
    productDetails: ProductDTO,
  ): Promise<ReturnStatus> {
    const { title, price, description, productStatus, type, tags } =
      productDetails;
    const user = await this.userModel.findById(userId);
    const productNo = generateNumber(7);
    const parentFolder = 'products';
    const imageUrls = [];

    try {
      for (const file of files) {
        const key = `${parentFolder}/${productNo}/${file.fieldname}`;
        await this.awsService.uploadFiles(files, parentFolder, productNo);

        imageUrls.push(key);
      }

      const product = await this.productModel.create({
        tags,
        title,
        price,
        description,
        productStatus,
        type,
        imageUrls,
        uploadedBy: user._id,
        productNo,
      });

      await product.save();

      await user.updateOne({
        $push: {
          listings: product,
        },
      });

      return { status: 'Success', msg: 'Product uploaded' };
    } catch (e) {
      const msg = e.message;
      console.log(e);
      return { status: 'Failed', msg };
    }
  }

  async findProducts() {
    return this.productModel.find().populate('uploadedBy', 'nameSurname');
  }
}
