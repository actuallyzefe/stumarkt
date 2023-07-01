import {
  Body,
  Controller,
  HttpCode,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { GetCurrentUserId } from 'src/auth/common/decorators';
import { ProductDTO } from './dtos/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseInterceptors(FileInterceptor('productImage'))
  @Post('/upload-product')
  @HttpCode(200)
  async uploadProduct(
    @GetCurrentUserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
    @Body() productDetails: ProductDTO,
  ) {
    return this.productsService.uploadProduct(file, userId, productDetails);
  }
}
