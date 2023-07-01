import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String })
  imageUrl: string;

  @Prop({ required: true, type: String })
  type: string;

  @Prop({ required: true, type: String })
  productStatus: string;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, type: String })
  productNo: string;

  @Prop({ required: false, type: Array })
  tags: string[];

  @Prop({ required: true, ref: 'User', type: mongoose.Types.ObjectId })
  uploadedBy: mongoose.Types.ObjectId;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);
