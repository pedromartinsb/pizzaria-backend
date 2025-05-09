import { AuthUserService } from '../../../services/user/AuthUserService';
import prismaClient from '../../../prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

jest.mock('../../../prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findFirst: jest.fn(),
    },
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('AuthUserService', () => {
  const service = new AuthUserService();

  const mockUser = {
    id: 'user-id',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed-password',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should authenticate and return token', async () => {
    (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(true);
    (sign as jest.Mock).mockReturnValue('mocked-jwt-token');

    const result = await service.execute({
      email: 'john@example.com',
      password: 'plain-password',
    });

    expect(result).toEqual({
      id: 'user-id',
      name: 'John Doe',
      email: 'john@example.com',
      token: 'mocked-jwt-token',
    });

    expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    });

    expect(compare).toHaveBeenCalledWith('plain-password', 'hashed-password');

    expect(sign).toHaveBeenCalledWith(
      { name: 'John Doe', email: 'john@example.com' },
      'test-secret',
      { subject: 'user-id', expiresIn: '30d' },
    );
  });

  it('should throw if user is not found', async () => {
    (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(
      service.execute({ email: 'notfound@example.com', password: '123456' }),
    ).rejects.toThrow('User/password incorrect');
  });

  it('should throw if password does not match', async () => {
    (prismaClient.user.findFirst as jest.Mock).mockResolvedValue(mockUser);
    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.execute({ email: 'john@example.com', password: 'wrong-password' }),
    ).rejects.toThrow('User/password incorrect');
  });
});
