import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDTO } from 'src/products/dtos/product.dto';
import { Product } from 'src/products/product.model';

@Injectable()
export class ProductHelperService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(
    imageUrls: string[],
    productNo: string,
    productDetails: ProductDTO,
  ) {
    return this.productModel.create({
      imageUrls,
      productNo,
      ...productDetails,
    });
  }

  async getProductByNo(productNo: string) {
    return this.productModel.findOne({ productNo });
  }

  async findProducts() {
    return this.productModel.find().populate('uploadedBy');
  }
}
