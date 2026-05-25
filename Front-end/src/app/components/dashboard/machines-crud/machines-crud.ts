import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachinesService, Machine } from '../../../../services/machines.service';

@Component({
  selector: 'app-machines-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './machines-crud.html',
  styleUrls: ['./machines-crud.css'],
})
export class MachinesCrud implements OnInit {
  private machinesService = inject(MachinesService);
  private fb = inject(FormBuilder);

  machines: Machine[] = [];
  machineForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentMachineId: string | null = null;
  loading = false;

  constructor() {
    this.machineForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      serialNumber: ['', Validators.required],
      equipmentType: ['', Validators.required],
      status: ['OPERATIONAL', Validators.required],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.loadMachines();
  }

  loadMachines(): void {
    this.loading = true;
    this.machinesService.getMachines().subscribe({
      next: (data) => {
        this.machines = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar máquinas', err);
        this.loading = false;
      }
    });
  }

  openForm(machine?: Machine): void {
    this.showForm = true;
    if (machine) {
      this.isEditing = true;
      this.currentMachineId = machine.id;
      this.machineForm.patchValue(machine);
    } else {
      this.isEditing = false;
      this.currentMachineId = null;
      this.machineForm.reset({ status: 'OPERATIONAL' });
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.machineForm.reset();
  }

  onSubmit(): void {
    if (this.machineForm.invalid) return;

    this.loading = true;
    const formData = this.machineForm.value;

    if (this.isEditing && this.currentMachineId) {
      this.machinesService.updateMachine(this.currentMachineId, formData).subscribe({
        next: () => {
          this.loadMachines();
          this.closeForm();
        },
        error: (err) => {
          console.error('Erro ao atualizar máquina', err);
          this.loading = false;
        }
      });
    } else {
      this.machinesService.createMachine(formData).subscribe({
        next: () => {
          this.loadMachines();
          this.closeForm();
        },
        error: (err) => {
          console.error('Erro ao criar máquina', err);
          this.loading = false;
        }
      });
    }
  }

  deleteMachine(id: string): void {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      this.loading = true;
      this.machinesService.deleteMachine(id).subscribe({
        next: () => this.loadMachines(),
        error: (err) => {
          console.error('Erro ao excluir máquina', err);
          this.loading = false;
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'OPERATIONAL': return 'status-operational';
      case 'MAINTENANCE': return 'status-maintenance';
      case 'IDLE': return 'status-idle';
      case 'INACTIVE': return 'status-inactive';
      default: return '';
    }
  }
}
