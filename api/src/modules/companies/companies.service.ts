import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtPayload } from '@/common/decorators/get-user.decorator';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: JwtPayload): Promise<Company> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas ADMINs podem criar empresas');
    }

    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findAll(user: JwtPayload): Promise<Company[]> {
    if (user.role === 'ADMIN') {
      return await this.companiesRepository.find();
    } else {
      return await this.companiesRepository.find({
        where: { id: user.companyId },
      });
    }
  }

  async findOne(id: string, user: JwtPayload): Promise<Company> {
    if (user.role !== 'ADMIN' && user.companyId !== id) {
      throw new ForbiddenException('Você não tem permissão para acessar esta empresa');
    }

    const company = await this.companiesRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: JwtPayload): Promise<Company> {
    if (user.role !== 'ADMIN' && user.companyId !== id) {
      throw new ForbiddenException('Você não tem permissão para atualizar esta empresa');
    }

    const company = await this.findOne(id, user);
    Object.assign(company, updateCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async remove(id: string, user: JwtPayload): Promise<void> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Apenas ADMINs podem deletar empresas');
    }

    const company = await this.findOne(id, user);
    await this.companiesRepository.remove(company);
  }
}
