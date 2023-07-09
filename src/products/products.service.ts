import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/aws/aws.service';
import { ProductDTO } from './dtos/product.dto';
import { ReturnStatus } from 'src/types';
import { GenerateNumberService } from 'src/utils/generate-number.service';
import { GetUserService } from 'src/utils/get-user.service';
import { ProductHelperService } from 'src/utils/product-helper.service';

@Injectable()
export class ProductsService {
  constructor(
    private productHelperService: ProductHelperService,
    private getUserService: GetUserService,
    private awsService: AwsService,
    private generateNumberService: GenerateNumberService,
  ) {}

  async uploadProduct(
    files: Express.Multer.File[],
    userId: number,
    productDetails: ProductDTO,
  ): Promise<ReturnStatus> {
    const user = await this.getUserService.getUserById(userId);
    const productNo = await this.generateNumberService.validNumber(7);
    const parentFolder = 'products';
    const imageUrls: string[] = [];

    try {
      for (const file of files) {
        const key = `${parentFolder}/${productNo}/${file.fieldname}`;
        await this.awsService.uploadFiles(files, parentFolder, productNo);

        imageUrls.push(key);
      }

      const product = await this.productHelperService.create(
        imageUrls,
        productNo,
        ...productDetails,
      );

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
    return this.productHelperService.findProducts();
  }
}
