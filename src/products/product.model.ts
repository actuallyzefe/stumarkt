import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  image: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: String })
  status: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: String })
  productNo: string;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
