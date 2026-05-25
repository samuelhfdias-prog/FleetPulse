import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { CompaniesService } from '../../../services/companies.service';
import { User, Company } from '../../../models/data.models';

@Component({
  selector: 'app-users-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-crud.html',
  styleUrls: ['../machines-crud/machines-crud.css'],
})
export class UsersCrud implements OnInit {
  private usersService = inject(UsersService);
  private companiesService = inject(CompaniesService);
  private fb = inject(FormBuilder);

  users: User[] = [];
  companies: Company[] = [];
  userForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentUserId: string | null = null;
  loading = false;

  constructor() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['USER', Validators.required],
      companyId: ['', Validators.required],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCompanies();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar usuários', err);
        this.loading = false;
      }
    });
  }

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data: Company[]) => this.companies = data,
      error: (err: any) => console.error('Erro ao carregar empresas', err)
    });
  }

  openForm(user?: User): void {
    this.showForm = true;
    if (user) {
      this.isEditing = true;
      this.currentUserId = user.id;
      this.userForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        password: ''
      });
      // A senha não é obrigatória na edição
      this.userForm.get('password')?.clearValidators();
    } else {
      this.isEditing = false;
      this.currentUserId = null;
      this.userForm.reset({ role: 'USER' });
      // A senha é obrigatória na criação
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  closeForm(): void {
    this.showForm = false;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    this.loading = true;
    const formData = { ...this.userForm.value };
    if (!formData.password) {
      delete formData.password; // não envia senha vazia se estiver editando
    }

    if (this.isEditing && this.currentUserId) {
      this.usersService.updateUser(this.currentUserId, formData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeForm();
        },
        error: (err: any) => {
          console.error('Erro ao atualizar usuário', err);
          this.loading = false;
        }
      });
    } else {
      this.usersService.createUser(formData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeForm();
        },
        error: (err: any) => {
          console.error('Erro ao criar usuário', err);
          this.loading = false;
        }
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.loading = true;
      this.usersService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err: any) => {
          console.error('Erro ao excluir usuário', err);
          this.loading = false;
        }
      });
    }
  }
}
