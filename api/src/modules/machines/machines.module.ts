import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine } from './machine.entity';
import { Company } from '../companies/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine, Company])],
  providers: [MachinesService],
  controllers: [MachinesController],
  exports: [MachinesService],
})
export class MachinesModule {}
