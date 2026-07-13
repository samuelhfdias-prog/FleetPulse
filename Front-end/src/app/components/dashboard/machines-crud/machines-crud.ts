import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachinesService, Machine } from '../../../services/machines.service';
import { CompaniesService } from '../../../services/companies.service';
import { AuthService, User } from '../../../services/auth.service';
import { Company } from '../../../models/data.models';

@Component({
  selector: 'app-machines-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machines-crud.html',
  styleUrls: ['./machines-crud.css'],
})
export class MachinesCrud implements OnInit {
  @Output() changed = new EventEmitter<void>();
  private machinesService = inject(MachinesService);
  private fb = inject(FormBuilder);
  private companiesService = inject(CompaniesService);
  private authService = inject(AuthService);

  machines: Machine[] = [];
  companies: Company[] = [];
  currentUser: User | null = this.authService.getCurrentUser();
  machineForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentMachineId: string | null = null;
  loading = false;
  errorMessage = '';

  constructor() {
    this.machineForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      equipmentType: ['', Validators.required],
      status: ['OPERATIONAL', Validators.required],
      location: [''],
      operatingHours: [0, [Validators.required, Validators.min(0)]],
      companyId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadMachines();
    this.loadCompanies();
  }

  loadMachines(): void {
    this.loading = true;
    this.errorMessage = '';
    this.machinesService.getMachines().subscribe({
      next: (data: Machine[]) => {
        this.machines = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar as máquinas.';
        this.loading = false;
      },
    });
  }

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
        const companyId =
          this.currentUser?.role === 'USER' ? this.currentUser.companyId : companies[0]?.id;
        if (!this.machineForm.value.companyId && companyId) {
          this.machineForm.patchValue({ companyId });
        }
      },
      error: () => (this.errorMessage = 'Não foi possível carregar as empresas.'),
    });
  }

  openForm(machine?: Machine): void {
    this.showForm = true;
    if (machine) {
      this.isEditing = true;
      this.currentMachineId = machine.id;
      this.machineForm.patchValue(machine);
      this.machineForm.get('serialNumber')?.disable();
      this.machineForm.get('equipmentType')?.disable();
      this.machineForm.get('companyId')?.disable();
    } else {
      this.isEditing = false;
      this.currentMachineId = null;
      this.machineForm.reset({
        status: 'OPERATIONAL',
        operatingHours: 0,
        companyId:
          this.currentUser?.role === 'USER'
            ? this.currentUser.companyId
            : this.companies[0]?.id || '',
      });
      this.machineForm.get('serialNumber')?.enable();
      this.machineForm.get('equipmentType')?.enable();
      if (this.currentUser?.role === 'ADMIN') this.machineForm.get('companyId')?.enable();
      else this.machineForm.get('companyId')?.disable();
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.machineForm.invalid) {
      this.machineForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const formData = this.machineForm.getRawValue();

    if (this.isEditing && this.currentMachineId) {
      const updateData = {
        name: formData.name,
        model: formData.model,
        status: formData.status,
        location: formData.location,
        operatingHours: formData.operatingHours,
      };
      this.machinesService.updateMachine(this.currentMachineId, updateData).subscribe({
        next: () => {
          this.changed.emit();
          this.loadMachines();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível atualizar a máquina.');
          this.loading = false;
        },
      });
    } else {
      this.machinesService.createMachine(formData).subscribe({
        next: () => {
          this.changed.emit();
          this.loadMachines();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível criar a máquina.');
          this.loading = false;
        },
      });
    }
  }

  deleteMachine(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      this.loading = true;
      this.machinesService.deleteMachine(id).subscribe({
        next: () => {
          this.changed.emit();
          this.loadMachines();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível excluir a máquina.');
          this.loading = false;
        },
      });
    }
  }

  getCompanyName(companyId: string): string {
    return (
      this.companies.find((company) => company.id === companyId)?.name || 'Empresa não identificada'
    );
  }

  private getErrorMessage(
    error: { error?: { message?: string | string[] } },
    fallback: string,
  ): string {
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || fallback;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPERATIONAL':
        return 'status-operational';
      case 'MAINTENANCE':
        return 'status-maintenance';
      case 'IDLE':
        return 'status-idle';
      case 'INACTIVE':
        return 'status-inactive';
      default:
        return '';
    }
  }
}
