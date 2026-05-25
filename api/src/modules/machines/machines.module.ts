import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { Machine } from './machine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Machine])],
  providers: [MachinesService],
  controllers: [MachinesController],
  exports: [MachinesService],
})
export class MachinesModule {}
