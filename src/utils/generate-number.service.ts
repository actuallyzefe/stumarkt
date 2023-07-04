import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/products/product.model';
import { User } from 'src/users/user.model';

@Injectable()
export class GenerateNumberService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findDuplicateNumber(accountOrProduct: string): Promise<string> {
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
    return existingNumber;
  }

  async validNumber(length: number): Promise<string> {
    try {
      let number = this.generateNumber(length);

      let existingNumber = await this.findDuplicateNumber(number);

      while (existingNumber) {
        number = this.generateNumber(length);

        existingNumber = await this.findDuplicateNumber(number);
      }

      return number;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  generateNumber(length: number): string {
    const digits = '0123456789';
    let number = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      number += digits[randomIndex];
    }

    return number;
  }
}
