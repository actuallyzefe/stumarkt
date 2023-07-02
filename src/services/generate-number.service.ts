import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/products/product.model';
import { User } from 'src/users/user.model';
import { generateNumber } from 'src/utils/generate-number';

@Injectable()
export class GenerateNumberService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findDuplicateNumber(accountOrProduct: string) {
    let existingNumber: string;
    if (accountOrProduct.length === 10) {
      existingNumber = await this.userModel.findOne({
        accountNumber: accountOrProduct,
      });
    } else {
      existingNumber = await this.productModel.findOne({
        productNo: accountOrProduct,
      });
    }
    console.log(existingNumber);
    return existingNumber;
  }

  async validAccountNumber() {
    try {
      let account_number = generateNumber(10);

      let existingAccountNumber = await this.findDuplicateNumber(
        account_number,
      );

      while (existingAccountNumber) {
        account_number = generateNumber(10);

        existingAccountNumber = await this.findDuplicateNumber(account_number);
      }

      return account_number;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async validProductNumber() {
    try {
      let productNumber = generateNumber(7);

      let existingProductNumber = await this.findDuplicateNumber(productNumber);

      while (existingProductNumber) {
        productNumber = generateNumber(7);

        existingProductNumber = await this.findDuplicateNumber(productNumber);
      }

      return productNumber;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
