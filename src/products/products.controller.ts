import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { GetCurrentUserId, Public } from 'src/auth/common/decorators';
import { ProductDTO } from './dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseInterceptors(FilesInterceptor('productImage'))
  @Post('/upload-product')
  async uploadProduct(
    @GetCurrentUserId() userId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() productDetails: ProductDTO,
  ) {
    return this.productsService.uploadProduct(files, userId, productDetails);
  }

  @Public()
  @Get('get')
  findProducts() {
    return this.productsService.findProducts();
  }
}
