import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/company.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtPayload } from '@/common/decorators/get-user.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @GetUser() user: JwtPayload): Promise<Company> {
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload): Promise<Company[]> {
    return this.companiesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<Company> {
    return this.companiesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @GetUser() user: JwtPayload): Promise<Company> {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<void> {
    return this.companiesService.remove(id, user);
  }
}
