import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine, MachineStatus } from './machine.entity';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';
import { JwtPayload } from '../../common/decorators/get-user.decorator';
import { Company } from '../companies/company.entity';

export interface MachineStatistics {
  total: number;
  operational: number;
  maintenance: number;
  idle: number;
  inactive: number;
  averageOperatingHours: number;
}

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private machinesRepository: Repository<Machine>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createMachineDto: CreateMachineDto, user: JwtPayload): Promise<Machine> {
    if (user.role === 'USER' && user.companyId !== createMachineDto.companyId) {
      throw new ForbiddenException('Você não tem permissão para criar máquinas em outra empresa');
    }

    const [duplicate, company] = await Promise.all([
      this.machinesRepository.findOne({ where: { serialNumber: createMachineDto.serialNumber } }),
      this.companiesRepository.findOne({
        where: { id: createMachineDto.companyId, isActive: true },
      }),
    ]);
    if (duplicate) throw new ConflictException('Número de série já cadastrado');
    if (!company) throw new NotFoundException('Empresa ativa não encontrada');

    const machine = this.machinesRepository.create(createMachineDto);
    return await this.machinesRepository.save(machine);
  }

  async findAll(user: JwtPayload): Promise<Machine[]> {
    if (user.role === 'ADMIN') {
      return await this.machinesRepository.find({
        relations: ['company'],
        order: { name: 'ASC' },
      });
    } else {
      return await this.machinesRepository.find({
        where: { companyId: user.companyId },
        relations: ['company'],
        order: { name: 'ASC' },
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
  async getStatistics(user: JwtPayload): Promise<MachineStatistics> {
    let machines;

    if (user.role === 'ADMIN') {
      machines = await this.machinesRepository.find();
    } else {
      machines = await this.machinesRepository.find({
        where: { companyId: user.companyId },
      });
    }

    const operational = machines.filter((m) => m.status === MachineStatus.OPERATIONAL).length;
    const maintenance = machines.filter((m) => m.status === MachineStatus.MAINTENANCE).length;
    const idle = machines.filter((m) => m.status === MachineStatus.IDLE).length;
    const inactive = machines.filter((m) => m.status === MachineStatus.INACTIVE).length;

    const totalOperatingHours = machines.reduce((sum, m) => sum + m.operatingHours, 0);

    return {
      total: machines.length,
      operational,
      maintenance,
      idle,
      inactive,
      averageOperatingHours:
        machines.length > 0 ? Math.round(totalOperatingHours / machines.length) : 0,
    };
  }
}
