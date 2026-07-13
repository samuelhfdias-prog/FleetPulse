import { ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Company } from '../companies/company.entity';
import { JwtPayload } from '../../common/decorators/get-user.decorator';
import { User, UserRole } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService authorization', () => {
  const companyId = '10fa5a07-3a2b-4e50-af63-0fa70ad2fbac';
  const actor: JwtPayload = {
    sub: '390c0e67-37ac-44b1-8884-187184f2a830',
    email: 'user@example.com',
    companyId,
    role: UserRole.USER,
  };

  let usersRepository: jest.Mocked<Partial<Repository<User>>>;
  let companiesRepository: jest.Mocked<Partial<Repository<Company>>>;
  let service: UsersService;

  beforeEach(() => {
    usersRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn((value) => value as User),
      save: jest.fn((value) => Promise.resolve(value as User)),
    } as unknown as jest.Mocked<Partial<Repository<User>>>;
    companiesRepository = {
      findOne: jest.fn().mockResolvedValue({ id: companyId, isActive: true } as Company),
    } as unknown as jest.Mocked<Partial<Repository<Company>>>;
    service = new UsersService(
      usersRepository as Repository<User>,
      companiesRepository as Repository<Company>,
    );
  });

  it('prevents a regular user from creating an administrator', async () => {
    await service.create(
      {
        email: 'new@example.com',
        password: 'strong-password',
        fullName: 'New User',
        companyId,
        role: UserRole.ADMIN,
      },
      actor,
    );

    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: UserRole.USER }),
    );
    expect(usersRepository.create).toHaveBeenCalledWith(
      expect.not.objectContaining({ password: 'strong-password' }),
    );
  });

  it('prevents a regular user from deleting accounts', async () => {
    await expect(service.remove(actor.sub, actor)).rejects.toBeInstanceOf(ForbiddenException);
  });
});
