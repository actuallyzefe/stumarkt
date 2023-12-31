import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.model';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { GenerateNumberService } from 'src/utils/generate-number.service';
import { Product, ProductSchema } from 'src/products/product.model';
import { GetUserService } from 'src/utils/get-user.service';
import { ProductHelperService } from 'src/utils/product-helper.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    GenerateNumberService,
    GetUserService,
    ProductHelperService,
  ],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
})
export class AuthModule {}
