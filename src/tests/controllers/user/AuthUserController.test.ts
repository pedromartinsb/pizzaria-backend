import { AuthUserController } from '../../../controllers/user/AuthUserController';
import { AuthUserService } from '../../../services/user/AuthUserService';
import { Request, Response } from 'express';

describe('AuthUserController', () => {
  it('should authenticate user and return token', async () => {
    const mockAuthResponse = {
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      token: 'mocked-jwt-token',
    };

    const req = {
      body: {
        email: 'john@example.com',
        password: '123456',
      },
    } as Request;

    const jsonMock = jest.fn();
    const res = {
      json: jsonMock,
    } as unknown as Response;

    // Mock do método execute no prototype
    const executeSpy = jest
      .spyOn(AuthUserService.prototype, 'execute')
      .mockResolvedValue(mockAuthResponse);

    const controller = new AuthUserController();
    await controller.handle(req, res);

    expect(executeSpy).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: '123456',
    });

    expect(jsonMock).toHaveBeenCalledWith(mockAuthResponse);
  });
});
