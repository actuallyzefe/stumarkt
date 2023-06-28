import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { ProductsController } from './products.controller';
import { AwsService } from 'src/aws/aws.service';
import { User, UserSchema } from 'src/users/user.model';

@Module({
  providers: [ProductsService, AwsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
