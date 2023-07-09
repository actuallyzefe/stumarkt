import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @IsString()
  @IsNotEmpty()
  productStatus: string;

  @IsArray()
  @IsNotEmpty()
  tags: string[];

  @IsString()
  @IsNotEmpty()
  type: string;

  [Symbol.iterator]() {
    const properties = Object.keys(this);
    let index = 0;
    return {
      next: () => {
        if (index < properties.length) {
          const key = properties[index];
          const value = this[key];
          index++;
          return { value, done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
  }
}
