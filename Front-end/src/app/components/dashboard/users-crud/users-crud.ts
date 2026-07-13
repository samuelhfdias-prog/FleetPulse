import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../../../services/users.service';
import { CompaniesService } from '../../../services/companies.service';
import { User, Company } from '../../../models/data.models';
import { AuthService, User as AuthUser } from '../../../services/auth.service';

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
  private authService = inject(AuthService);

  users: User[] = [];
  companies: Company[] = [];
  userForm: FormGroup;
  showForm = false;
  isEditing = false;
  currentUserId: string | null = null;
  loading = false;
  errorMessage = '';
  currentUser: AuthUser | null = this.authService.getCurrentUser();

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
    this.errorMessage = '';
    this.usersService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os usuários.';
        this.loading = false;
      },
    });
  }

  loadCompanies(): void {
    this.companiesService.getCompanies().subscribe({
      next: (data: Company[]) => {
        this.companies = data;
        const companyId =
          this.currentUser?.role === 'USER' ? this.currentUser.companyId : data[0]?.id;
        if (!this.userForm.value.companyId && companyId) this.userForm.patchValue({ companyId });
      },
      error: () => (this.errorMessage = 'Não foi possível carregar as empresas.'),
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
        password: '',
      });
      this.userForm.get('email')?.disable();
      this.userForm.get('companyId')?.disable();
      if (this.currentUser?.role === 'USER') this.userForm.get('role')?.disable();
      // A senha não é obrigatória na edição
      this.userForm.get('password')?.clearValidators();
    } else {
      this.isEditing = false;
      this.currentUserId = null;
      this.userForm.reset({
        role: 'USER',
        companyId:
          this.currentUser?.role === 'USER'
            ? this.currentUser.companyId
            : this.companies[0]?.id || '',
      });
      this.userForm.get('email')?.enable();
      if (this.currentUser?.role === 'ADMIN') {
        this.userForm.get('companyId')?.enable();
        this.userForm.get('role')?.enable();
      } else {
        this.userForm.get('companyId')?.disable();
        this.userForm.get('role')?.disable();
      }
      // A senha é obrigatória na criação
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
  }

  closeForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const formData = { ...this.userForm.getRawValue() };
    if (!formData.password) {
      delete formData.password; // não envia senha vazia se estiver editando
    }

    if (this.isEditing && this.currentUserId) {
      const updateData: { fullName: string; password?: string; role?: 'ADMIN' | 'USER' } = {
        fullName: formData.fullName,
      };
      if (formData.password) updateData.password = formData.password;
      if (this.currentUser?.role === 'ADMIN') updateData.role = formData.role;
      this.usersService.updateUser(this.currentUserId, updateData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível atualizar o usuário.');
          this.loading = false;
        },
      });
    } else {
      this.usersService.createUser(formData).subscribe({
        next: () => {
          this.loadUsers();
          this.closeForm();
        },
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível criar o usuário.');
          this.loading = false;
        },
      });
    }
  }

  deleteUser(id: string): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.loading = true;
      this.usersService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err: { error?: { message?: string | string[] } }) => {
          this.errorMessage = this.getErrorMessage(err, 'Não foi possível excluir o usuário.');
          this.loading = false;
        },
      });
    }
  }

  canEdit(user: User): boolean {
    return this.currentUser?.role === 'ADMIN' || this.currentUser?.id === user.id;
  }

  getCompanyName(companyId: string): string {
    return this.companies.find((company) => company.id === companyId)?.name || '—';
  }

  private getErrorMessage(
    error: { error?: { message?: string | string[] } },
    fallback: string,
  ): string {
    const message = error.error?.message;
    return Array.isArray(message) ? message.join(' ') : message || fallback;
  }
}
