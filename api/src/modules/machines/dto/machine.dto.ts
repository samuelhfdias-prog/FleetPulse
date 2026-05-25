import { IsString, IsOptional, IsEnum, IsInt, IsDate } from 'class-validator';
import { MachineStatus } from '../machine.entity';

export class CreateMachineDto {
  @IsString()
  name: string;

  @IsString()
  model: string;

  @IsString()
  serialNumber: string;

  @IsString()
  equipmentType: string;

  @IsString()
  companyId: string;

  @IsOptional()
  @IsDate()
  manufactureDate?: Date;

  @IsOptional()
  @IsDate()
  installationDate?: Date;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  operatingHours?: number;
}

export class UpdateMachineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  operatingHours?: number;

  @IsOptional()
  @IsDate()
  lastMaintenance?: Date;
}
