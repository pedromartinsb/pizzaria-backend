import { CreateCategoryController } from '../../../controllers/category/CreateCategoryController';
import { CreateCategoryService } from '../../../services/category/CreateCategoryService';
import { Request, Response } from 'express';

jest.mock('../../../services/category/CreateCategoryService');

describe('CreateCategoryController', () => {
  it('should create category and return it', async () => {
    const mockCategory = { id: 1, name: 'Pizzas' };

    const req = {
      body: {
        name: 'Pizzas',
      },
    } as Request;

    const jsonMock = jest.fn();
    const res = {
      json: jsonMock,
    } as unknown as Response;

    (CreateCategoryService as jest.Mock).mockImplementation(() => {
      return {
        execute: jest.fn().mockResolvedValue(mockCategory),
      };
    });

    const controller = new CreateCategoryController();
    await controller.handle(req, res);

    expect(jsonMock).toHaveBeenCalledWith(mockCategory);
  });
});
