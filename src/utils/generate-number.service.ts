import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetUserService } from './get-user.service';
import { ProductHelperService } from './product-helper.service';

@Injectable()
export class GenerateNumberService {
  constructor(
    private getUserService: GetUserService,
    private productHelperService: ProductHelperService,
  ) {}

  async findDuplicateNumber(accountOrProduct: string): Promise<Object> {
    let existingNumber: {};
    if (accountOrProduct.length === 10) {
      existingNumber = await this.getUserService.getUserByAccountNumber(
        accountOrProduct,
      );
    } else {
      existingNumber = await this.productHelperService.getProductByNo(
        accountOrProduct,
      );
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
