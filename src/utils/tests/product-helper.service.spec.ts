import { Test } from '@nestjs/testing';
import { ProductHelperService } from '../product-helper.service';
import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Product } from '../../products/product.model';

describe('ProductsHelperService', () => {
  let productHelperService: ProductHelperService;
  let model: Model<Product>;

  const mockProduct = {
    _id: '64aa8bdbabfadeaf1abee8a5',
    title: 'Mock Product',
    description: 'Descasdasdda',
    imageUrls: ['jaja.jpeg', 'jaja.jpeg'],
    type: 'Mock Type',
    productStatus: 'Newly Mocked',
    price: 31,
    productNo: '1234567',
    tags: ['tag1', 'tag2'],
  };
  const mockProduct2 = {
    _id: '64aa8bdbabfadeaf1abee8a1',
    title: 'Mock Product2',
    description: 'Descasdasdda',
    imageUrls: ['jaja.jpeg', 'jaja.jpeg'],
    type: 'Mock Type',
    productStatus: 'Newly Mocked2',
    price: 311,
    productNo: '7654321',
    tags: ['tag1', 'tag2'],
  };

  const productList = [mockProduct, mockProduct2];

  const mockProductHelperService = {
    findOne: jest.fn(),
    find: jest.fn().mockReturnThis(),
    populate: jest.fn().mockResolvedValue(productList),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProductHelperService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductHelperService,
        },
      ],
    }).compile();

    productHelperService =
      module.get<ProductHelperService>(ProductHelperService);

    model = module.get<Model<Product>>(getModelToken(Product.name));
  });

  describe('getProductByNo', () => {
    it('should find the product by its number and return it', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockProduct);
      const result = await productHelperService.getProductByNo(
        mockProduct.productNo,
      );

      expect(model.findOne).toHaveBeenCalledWith({
        productNo: mockProduct.productNo,
      });

      expect(result).toEqual(mockProduct);
    });
  });

  describe('findProducts', () => {
    it('should return a list of products', async () => {
      const result = await productHelperService.findProducts();

      expect(mockProductHelperService.find).toHaveBeenCalled();
      expect(mockProductHelperService.populate).toHaveBeenCalledWith(
        'uploadedBy',
      );
      expect(result).toEqual(productList);
    });
  });
});
