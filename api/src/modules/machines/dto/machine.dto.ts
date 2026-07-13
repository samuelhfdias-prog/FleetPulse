import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDate,
  IsUUID,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { MachineStatus } from '../machine.entity';

export class CreateMachineDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  serialNumber: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  equipmentType: string;

  @IsUUID()
  companyId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  manufactureDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  installationDate?: Date;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  operatingHours?: number;
}

export class UpdateMachineDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model?: string;

  @IsOptional()
  @IsEnum(MachineStatus)
  status?: MachineStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  operatingHours?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastMaintenance?: Date;
}
