import { CreateCategoryService } from '../../../services/category/CreateCategoryService';
import prismaClient from '../../../prisma';

jest.mock('../../../prisma', () => {
  return {
    __esModule: true,
    default: {
      category: {
        create: jest.fn(),
      },
    },
  };
});

describe('CreateCategoryService', () => {
  let createCategoryService: CreateCategoryService;

  beforeEach(() => {
    createCategoryService = new CreateCategoryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if the category name is empty', async () => {
    try {
      await createCategoryService.execute({ name: '' });
    } catch (error) {
      expect(error.message).toBe('Name invalid');
    }
  });

  it('should create a category successfully', async () => {
    // mock da resposta do prisma client
    const mockCategory = {
      id: 1,
      name: 'Test Category',
    };

    prismaClient.category.create = jest.fn().mockResolvedValue(mockCategory);

    const category = await createCategoryService.execute({
      name: 'Test Category',
    });

    expect(prismaClient.category.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Category',
      },
      select: {
        id: true,
        name: true,
      },
    });

    expect(category).toEqual(mockCategory);
  });

  it('should handle errors throws by Prisma client', async () => {
    const mockError = new Error('Database error');
    prismaClient.category.create = jest.fn().mockRejectedValue(mockError);

    try {
      await createCategoryService.execute({ name: 'Test Category' });
    } catch (error) {
      expect(error.message).toBe('Database error');
    }
  });
});
