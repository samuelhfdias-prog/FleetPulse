import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './machine.entity';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';
import { JwtPayload } from '@/common/decorators/get-user.decorator';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>,
  ) {}

  async create(createMachineDto: CreateMachineDto, user: JwtPayload): Promise<Machine> {
    // Apenas ADMINs ou USERs da sua company podem criar máquinas
    if (user.role === 'USER' && user.companyId !== createMachineDto.companyId) {
      throw new ForbiddenException('Você não tem permissão para criar máquinas em outra empresa');
    }

    const machine = this.machinesRepository.create(createMachineDto);
    return await this.machinesRepository.save(machine);
  }

  async findAll(user: JwtPayload): Promise<Machine[]> {
    if (user.role === 'ADMIN') {
      return await this.machinesRepository.find({
        relations: ['company'],
      });
    } else {
      return await this.machinesRepository.find({
        where: { companyId: user.companyId },
        relations: ['company'],
      });
    }
  }

  async findByCompany(companyId: string, user: JwtPayload): Promise<Machine[]> {
    if (user.role !== 'ADMIN' && user.companyId !== companyId) {
      throw new ForbiddenException('Você não tem permissão para acessar máquinas de outra empresa');
    }

    return await this.machinesRepository.find({
      where: { companyId },
      relations: ['company'],
    });
  }

  async findOne(id: string, user: JwtPayload): Promise<Machine> {
    const machine = await this.machinesRepository.findOne({
      where: { id },
      relations: ['company'],
    });

    if (!machine) {
      throw new NotFoundException('Máquina não encontrada');
    }

    if (user.role !== 'ADMIN' && user.companyId !== machine.companyId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta máquina');
    }

    return machine;
  }

  async update(id: string, updateMachineDto: UpdateMachineDto, user: JwtPayload): Promise<Machine> {
    const machine = await this.findOne(id, user);
    Object.assign(machine, updateMachineDto);
    return await this.machinesRepository.save(machine);
  }

  async remove(id: string, user: JwtPayload): Promise<void> {
    const machine = await this.findOne(id, user);
    await this.machinesRepository.remove(machine);
  }

  // Dashboard statistics
  async getStatistics(user: JwtPayload): Promise<any> {
    let machines;

    if (user.role === 'ADMIN') {
      machines = await this.machinesRepository.find();
    } else {
      machines = await this.machinesRepository.find({
        where: { companyId: user.companyId },
      });
    }

    const operational = machines.filter((m) => m.status === 'OPERATIONAL').length;
    const maintenance = machines.filter((m) => m.status === 'MAINTENANCE').length;
    const idle = machines.filter((m) => m.status === 'IDLE').length;
    const inactive = machines.filter((m) => m.status === 'INACTIVE').length;

    const totalOperatingHours = machines.reduce((sum, m) => sum + m.operatingHours, 0);

    return {
      total: machines.length,
      operational,
      maintenance,
      idle,
      inactive,
      averageOperatingHours: machines.length > 0 ? Math.round(totalOperatingHours / machines.length) : 0,
    };
  }
}
