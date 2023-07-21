import { Test } from '@nestjs/testing';
import { ProductHelperService } from '../product-helper.service';
import { GetUserService } from '../get-user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../users/user.model';
import { Model } from 'mongoose';
import { Product } from '../../products/product.model';
import { GenerateNumberService } from '../generate-number.service';
import { error } from 'console';

describe('GenerateNumberService', () => {
  let getUserService: GetUserService;
  let model: Model<User>;

  let productHelperService: ProductHelperService;
  let productModel: Model<Product>;

  let generateNumberService: GenerateNumberService;

  const mockUser = {
    _id: parseInt('64a2b2c6c228fb513630d87c'),
    nameSurname: 'Efe Karakanlı',
    accountNumber: '1234321',
  };
  const mockUser2 = {
    _id: parseInt('64a2b2c6c228fb513630d87a'),
    nameSurname: 'Efe Karakanlı',
    accountNumber: '1234321',
  };
  const mockUser3 = {
    _id: parseInt('64a2b2c6c228fb513630d87a'),
    nameSurname: 'Efe Karakanlı',
    accountNumber: '1234567',
  };

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
    productNo: '1234567',
    tags: ['tag1', 'tag2'],
  };

  const productList = [mockProduct, mockProduct2];
  const userList = [mockUser, mockUser2];

  const mockProductHelperService = {
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockGetUserService = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };
  const mockGenerateNumberService = {
    getUserByAccountNumber: jest.fn(),
    getProductByNo: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GenerateNumberService,
        GetUserService,
        {
          provide: getModelToken(User.name),
          useValue: mockGetUserService,
        },

        ProductHelperService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductHelperService,
        },
      ],
    }).compile();

    getUserService = module.get<GetUserService>(GetUserService);
    productHelperService =
      module.get<ProductHelperService>(ProductHelperService);
    model = module.get<Model<User>>(getModelToken(User.name));
    productModel = module.get<Model<Product>>(getModelToken(Product.name));

    generateNumberService = module.get<GenerateNumberService>(
      GenerateNumberService,
    );
  });

  describe('generateNumber', () => {
    it('should generate number', () => {
      jest
        .spyOn(generateNumberService, 'generateNumber')
        .mockImplementation(() => mockUser.accountNumber);

      const result = generateNumberService.generateNumber(10);

      expect(generateNumberService.generateNumber).toHaveBeenCalledWith(10);

      expect(result).toBeDefined();
    });
  });

  describe('findDuplicateNumber', () => {
    it('should find duplicated account number', async () => {
      jest
        .spyOn(generateNumberService, 'findDuplicateNumber')
        .mockResolvedValue('1234567');

      const result = await generateNumberService.findDuplicateNumber('1234567');

      expect(generateNumberService.findDuplicateNumber).toHaveBeenCalledWith(
        mockUser2.accountNumber,
      );

      expect(result).toEqual(mockUser.accountNumber);
    });

    it('should find duplicated product number', async () => {
      jest
        .spyOn(generateNumberService, 'findDuplicateNumber')
        .mockResolvedValue(mockProduct.productNo);

      const result = await generateNumberService.findDuplicateNumber(
        mockProduct.productNo,
      );

      expect(generateNumberService.findDuplicateNumber).toHaveBeenCalledWith(
        mockProduct2.productNo,
      );

      expect(result).toEqual(mockProduct2.productNo);
    });
  });

  describe('validNumber', () => {
    it('should regenerate the product number if the created number is duplicated', async () => {
      jest
        .spyOn(generateNumberService, 'findDuplicateNumber')
        .mockResolvedValue('1234567');

      const duplicated = await generateNumberService.findDuplicateNumber(
        '1234567',
      );

      expect(generateNumberService.findDuplicateNumber).toHaveBeenCalledWith(
        '1234567',
      );

      expect(duplicated).toEqual(mockProduct.productNo);

      const newNumber = generateNumberService.generateNumber(7);

      expect(newNumber).not.toBe(mockProduct.productNo);
    });

    it('should regenerate the account number if the created number is duplicated', async () => {
      jest
        .spyOn(generateNumberService, 'findDuplicateNumber')
        .mockResolvedValue('1234321');

      const duplicated = await generateNumberService.findDuplicateNumber(
        '1234321',
      );

      expect(generateNumberService.findDuplicateNumber).toHaveBeenCalledWith(
        '1234321',
      );

      expect(duplicated).toEqual(mockUser.accountNumber);

      const newNumber = generateNumberService.generateNumber(10);

      expect(newNumber).not.toBe(mockUser.accountNumber);
    });
  });
});
