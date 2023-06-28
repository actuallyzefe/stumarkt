import {
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

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-image')
  @HttpCode(200)
  async uploadSelfie(
    @GetCurrentUserId() userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const parentFolder = 'products';
    return this.productsService.uploadProductImages(file, userId, parentFolder);
  }
}
