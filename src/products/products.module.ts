import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { ProductsController } from './products.controller';
import { AwsService } from 'src/aws/aws.service';
import { User, UserSchema } from 'src/users/user.model';
import { GenerateNumberService } from 'src/utils/generate-number.service';

@Module({
  providers: [ProductsService, AwsService, GenerateNumberService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
