import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { GetUserService } from '../get-user.service';
import { Model } from 'mongoose';
import { User } from '../../users/user.model';

describe('GetUserService', () => {
  let getUserService: GetUserService;
  let model: Model<User>;

  const mockUser = {
    _id: parseInt('64a2b2c6c228fb513630d87c'),
    nameSurname: 'Efe Karakanlı',
    accountNumber: '1234567890',
  };

  const mockGetUserService = {
    findOne: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetUserService,
        {
          provide: getModelToken(User.name),
          useValue: mockGetUserService,
        },
      ],
    }).compile();
    getUserService = module.get<GetUserService>(GetUserService);

    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('getUserById', () => {
    it('should find user by id', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(mockUser);
      const result = await getUserService.getUserById(mockUser._id);

      expect(model.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByAccountNumber', () => {
    it('should find user by id', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);
      const result = await getUserService.getUserByAccountNumber(
        mockUser.accountNumber,
      );

      expect(model.findOne).toHaveBeenCalledWith({
        accountNumber: mockUser.accountNumber,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByNameSurname', () => {
    it('should find user by nameSurname', async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(mockUser);
      const result = await getUserService.getUserByNameSurname(
        mockUser.nameSurname,
      );

      expect(model.findOne).toHaveBeenCalledWith({
        nameSurname: mockUser.nameSurname,
      });
      expect(result).toEqual(mockUser);
    });
  });
});
