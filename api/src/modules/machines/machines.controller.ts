import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { Machine } from './machine.entity';
import { CreateMachineDto, UpdateMachineDto } from './dto/machine.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorators/get-user.decorator';
import { JwtPayload } from '@/common/decorators/get-user.decorator';

@Controller('machines')
@UseGuards(JwtAuthGuard)
export class MachinesController {
  constructor(private machinesService: MachinesService) {}

  @Post()
  create(@Body() createMachineDto: CreateMachineDto, @GetUser() user: JwtPayload): Promise<Machine> {
    return this.machinesService.create(createMachineDto, user);
  }

  @Get()
  findAll(@GetUser() user: JwtPayload): Promise<Machine[]> {
    return this.machinesService.findAll(user);
  }

  @Get('company/:companyId')
  findByCompany(@Param('companyId') companyId: string, @GetUser() user: JwtPayload): Promise<Machine[]> {
    return this.machinesService.findByCompany(companyId, user);
  }

  @Get('statistics')
  getStatistics(@GetUser() user: JwtPayload): Promise<any> {
    return this.machinesService.getStatistics(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<Machine> {
    return this.machinesService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMachineDto: UpdateMachineDto, @GetUser() user: JwtPayload): Promise<Machine> {
    return this.machinesService.update(id, updateMachineDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: JwtPayload): Promise<void> {
    return this.machinesService.remove(id, user);
  }
}
