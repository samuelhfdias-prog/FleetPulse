import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtPayload } from '@/common/decorators/get-user.decorator';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, user: JwtPayload): Promise<User> {
    // Apenas ADMINs podem criar usuários ou USERs podem criar na sua company
    if (user.role === 'USER' && user.companyId !== createUserDto.companyId) {
      throw new ForbiddenException('Você não tem permissão para criar usuários em outra empresa');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });

    return await this.usersRepository.save(newUser);
  }

  async findAll(user: JwtPayload): Promise<User[]> {
    if (user.role === 'ADMIN') {
      return await this.usersRepository.find();
    } else {
      return await this.usersRepository.find({
        where: { companyId: user.companyId },
      });
    }
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

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(targetUser, {
      ...updateUserDto,
      ...(updateUserDto.password && { passwordHash: updateUserDto.password }),
    });

    return await this.usersRepository.save(targetUser);
  }

  async remove(id: string, user: JwtPayload): Promise<void> {
    const targetUser = await this.findOne(id, user);
    await this.usersRepository.remove(targetUser);
  }
}
