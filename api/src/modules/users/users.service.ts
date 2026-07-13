import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtPayload } from '../../common/decorators/get-user.decorator';
import * as bcrypt from 'bcryptjs';
import { Company } from '../companies/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createUserDto: CreateUserDto, user: JwtPayload): Promise<User> {
    if (user.role === 'USER' && user.companyId !== createUserDto.companyId) {
      throw new ForbiddenException('Você não tem permissão para criar usuários em outra empresa');
    }

    const [existingUser, company] = await Promise.all([
      this.usersRepository.findOne({ where: { email: createUserDto.email } }),
      this.companiesRepository.findOne({ where: { id: createUserDto.companyId, isActive: true } }),
    ]);
    if (existingUser) throw new ConflictException('Email já cadastrado');
    if (!company) throw new NotFoundException('Empresa ativa não encontrada');

    const { password, role, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = this.usersRepository.create({
      ...userData,
      passwordHash: hashedPassword,
      role: user.role === 'ADMIN' ? role || UserRole.USER : UserRole.USER,
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(user: JwtPayload): Promise<User[]> {
    return user.role === 'ADMIN'
      ? this.usersRepository.find({ order: { fullName: 'ASC' } })
      : this.usersRepository.find({
          where: { companyId: user.companyId },
          order: { fullName: 'ASC' },
        });
  }

  async findOne(id: string, user: JwtPayload): Promise<User> {
    const targetUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.role !== 'ADMIN' && user.companyId !== targetUser.companyId) {
      throw new ForbiddenException('Você não tem permissão para acessar este usuário');
    }

    return targetUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user: JwtPayload): Promise<User> {
    const targetUser = await this.findOne(id, user);
    if (user.role !== 'ADMIN' && user.sub !== targetUser.id) {
      throw new ForbiddenException('Você só pode alterar o seu próprio perfil');
    }

    const { password, role, ...safeUpdates } = updateUserDto;
    Object.assign(targetUser, safeUpdates);

    if (password) {
      targetUser.passwordHash = await bcrypt.hash(password, 12);
    }
    if (role && user.role === 'ADMIN') targetUser.role = role;

    return await this.usersRepository.save(targetUser);
  }

  async remove(id: string, user: JwtPayload): Promise<void> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas administradores podem excluir usuários');
    }
    if (id === user.sub) {
      throw new ForbiddenException('Não é possível excluir o próprio usuário autenticado');
    }
    const targetUser = await this.findOne(id, user);
    await this.usersRepository.remove(targetUser);
  }
}
