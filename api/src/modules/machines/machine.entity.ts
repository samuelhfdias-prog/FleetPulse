import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Company } from '../companies/company.entity';

export enum MachineStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  IDLE = 'IDLE',
  INACTIVE = 'INACTIVE',
}

@Entity('machines')
@Index(['companyId'])
@Index(['status'])
export class Machine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  model: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'varchar', length: 100 })
  equipmentType: string;

  @Column({ type: 'date', nullable: true })
  manufactureDate: Date;

  @Column({ type: 'date', nullable: true })
  installationDate: Date;

  @Column({ type: 'enum', enum: MachineStatus, default: MachineStatus.OPERATIONAL })
  status: MachineStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'timestamp', nullable: true })
  lastMaintenance: Date;

  @Column({ type: 'int', default: 0 })
  operatingHours: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Company, (company) => company.machines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
